from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Contact, Lead, Task, ActivityLog
from datetime import datetime

contacts_bp = Blueprint('contacts', __name__)


# GET all contacts for current user
@contacts_bp.route('/', methods=['GET'])
@jwt_required()
def get_contacts():
    current_user_id = get_jwt_identity()
    contacts = Contact.query.filter_by(user_id=current_user_id).all()

    results = []
    for contact in contacts:
        last_interaction = (
            max([log.created_at for log in contact.activity_logs])
            .isoformat() if contact.activity_logs else None
        )

        results.append({
            'id': contact.id,
            'name': contact.name,
            'email': contact.email,
            'phone': contact.phone,
            'company': contact.company,
            'user_id': contact.user_id,
            'created_at': contact.created_at.isoformat(),
            'lead_status': contact.lead.status if contact.lead else None,
            'tasks_count': len(contact.tasks),
            'last_interaction': last_interaction
        })

    return jsonify(results), 200




# GET single contact (current user only)
@contacts_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_contact(id):
    current_user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=id, user_id=current_user_id).first()

    if not contact:
        return jsonify(error="Contact not found or you don't have access"), 404

    return jsonify({
        'id': contact.id,
        'name': contact.name,
        'email': contact.email,
        'phone': contact.phone,
        'company': contact.company,
        'user_id': contact.user_id,
        'created_at': contact.created_at.isoformat(),
        'lead_status': contact.lead.status if contact.lead else None,  # ✅ Use singular 'lead'
        'tasks': [
            {'id': task.id, 'title': task.title, 'completed': task.completed}
            for task in contact.tasks
        ],
        'activity_logs': [
            {'id': log.id, 'interaction_type': log.interaction_type, 'notes': log.notes,
             'created_at': log.created_at.isoformat()}
            for log in contact.activity_logs
        ]
    }), 200





# POST create a new contact

@contacts_bp.route('/', methods=['POST'])
@jwt_required()
def create_contact():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400

    try:
        new_contact = Contact(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            company=data.get('company'),
            user_id=current_user_id,
            created_at=datetime.utcnow()
        )
        db.session.add(new_contact)
        db.session.commit()

        return jsonify({'message': 'Contact created successfully', 'id': new_contact.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400



# PATCH update an existing contact

@contacts_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_contact(id):
    current_user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=id, user_id=current_user_id).first_or_404()
    data = request.get_json()

    contact.name = data.get('name', contact.name)
    contact.email = data.get('email', contact.email)
    contact.phone = data.get('phone', contact.phone)
    contact.company = data.get('company', contact.company)
    contact.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({'message': 'Contact updated successfully'}), 200



# DELETE a contact

@contacts_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_contact(id):
    current_user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=id, user_id=current_user_id).first_or_404()

    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact deleted'}), 200
