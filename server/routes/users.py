from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
)
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

users_bp = Blueprint("users", __name__)

@users_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    missing = [k for k in ("username", "email", "password") if k not in data]
    if missing:
        return jsonify(error=f"Missing fields: {', '.join(missing)}"), 400

    if User.query.filter((User.username == data["username"]) | (User.email == data["email"])).first():
        return jsonify(error="Username or email already exists"), 409

    user = User(
        username=data["username"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        role=data.get("role", "sales_rep"),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(message="User registered", user_id=user.id), 201

@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not check_password_hash(user.password_hash, data.get("password", "")):
        return jsonify(error="Invalid credentials"), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=2))
    refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(days=7))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict()
    }), 200

@users_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    new_access = create_access_token(identity=user_id, expires_delta=timedelta(hours=2))
    return jsonify(access_token=new_access), 200

@users_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    resp = jsonify(message="Logged out")
    unset_jwt_cookies(resp)
    return resp, 200

def _is_admin(user: User) -> bool:
    return user.role == "admin"

@users_bp.route("/", methods=["GET"])
@jwt_required()
def list_users():
    current_user = User.query.get_or_404(get_jwt_identity())
    if not _is_admin(current_user):
        return jsonify(error="Admin privilege required"), 403

    return jsonify([u.to_dict() for u in User.query.all()]), 200

@users_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get_or_404(current_user_id)

    if id != current_user_id and not _is_admin(current_user):
        return jsonify(error="Forbidden"), 403

    return jsonify(User.query.get_or_404(id).to_dict()), 200

@users_bp.route("/<int:id>", methods=["PATCH"])
@jwt_required()
def update_user(id):
    current_user = User.query.get_or_404(get_jwt_identity())
    if id != current_user.id and not _is_admin(current_user):
        return jsonify(error="Forbidden"), 403

    user = User.query.get_or_404(id)
    data = request.get_json() or {}

    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)

    if data.get("password"):
        user.password_hash = generate_password_hash(data["password"])

    db.session.commit()
    return jsonify(message="User updated"), 200

@users_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    current_user = User.query.get_or_404(get_jwt_identity())
    if id != current_user.id and not _is_admin(current_user):
        return jsonify(error="Forbidden"), 403

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify(message="User deleted"), 200
