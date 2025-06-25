from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task, Contact
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

# GET all tasks for the current user's contacts
@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()
    contacts = Contact.query.filter_by(user_id=current_user_id).all()
    contact_ids = [c.id for c in contacts]

    tasks = Task.query.filter(Task.contact_id.in_(contact_ids)).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'status': task.status,
        'completed': task.completed,
        'contact_id': task.contact_id,
        'created_at': task.created_at.isoformat()
    } for task in tasks]), 200



@tasks_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_task(id):
    current_user_id = get_jwt_identity()
    task = Task.query.get_or_404(id)
    contact = Contact.query.get(task.contact_id)

    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'status': task.status,
        'completed': task.completed,
        'contact_id': task.contact_id,
        'created_at': task.created_at.isoformat()
    }), 200



@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    # Validate contact ownership
    contact = Contact.query.filter_by(id=data.get('contact_id'), user_id=current_user_id).first()
    if not contact:
        return jsonify({'error': 'Invalid or unauthorized contact'}), 400

    if not data.get('title') or not data.get('status'):
        return jsonify({'error': 'Title and status are required'}), 400

    try:
        new_task = Task(
            title=data['title'],
            description=data.get('description'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
            status=data['status'],
            completed=data.get('completed', False),
            contact_id=contact.id
        )
        db.session.add(new_task)
        db.session.commit()

        return jsonify({'message': 'Task created successfully', 'id': new_task.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400



@tasks_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_task(id):
    data = request.get_json()
    current_user_id = get_jwt_identity()

    task = Task.query.get_or_404(id)
    contact = Contact.query.get(task.contact_id)

    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.status = data.get('status', task.status)
    task.completed = data.get('completed', task.completed)

    if 'due_date' in data:
        task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None

    db.session.commit()
    return jsonify({'message': 'Task updated successfully'}), 200



@tasks_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    current_user_id = get_jwt_identity()
    task = Task.query.get_or_404(id)
    contact = Contact.query.get(task.contact_id)

    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200
