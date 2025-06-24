from flask import Blueprint, request, jsonify
from models import db, Contact, User
from datetime import datetime


contacts_bp = Blueprint('contacts', __name__)

# Retrieve all contacts
@contacts_bp.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([{
        'id': contact.id,
        'name': contact.name,
        'email': contact.email,
        'phone': contact.phone,
        'company': contact.company,
        'user_id': contact.user_id,
        'created_at': contact.created_at.isoformat()
    } for contact in contacts]), 200

# Retrieve a single contact by ID
@contacts_bp.route('/<int:id>', methods=['GET'])
def get_contact(id):
    contact = Contact.query.get_or_404(id)
    return jsonify({
        'id': contact.id,
        'name': contact.name,
        'email': contact.email,
        'phone': contact.phone,
        'company': contact.company,
        'user_id': contact.user_id,
        'created_at': contact.created_at.isoformat()
    }), 200

# Create a new contact
@contacts_bp.route('/', methods=['POST'])
def create_contact():
    data = request.get_json()
    try:
        new_contact = Contact(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            company=data.get('company'),
            user_id=data['user_id'],
            created_at=datetime.utcnow()
        )
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({'message': 'Contact created successfully', 'id': new_contact.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Update an existing contact
@contacts_bp.route('/<int:id>', methods=['PATCH'])
def update_contact(id):

    contact = Contact.query.get_or_404(id)
    data = request.get_json()

    contact.name = data.get('name', contact.name)
    contact.email = data.get('email', contact.email)
    contact.phone = data.get('phone', contact.phone)
    contact.company = data.get('company', contact.company)

    db.session.commit()
    return jsonify({'message': 'Contact updated successfully'}), 200


# Delete a contact
@contacts_bp.route('/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = Contact.query.get_or_404(id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact deleted'}), 204