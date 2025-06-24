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

    



@contacts_bp.route('/', methods=['POST'])
def create_contact():
    pass



@contacts_bp.route('/<int:id>', methods=['PATCH'])
def update_contact(id):
    pass




@contacts_bp.route('/<int:id>', methods=['DELETE'])
def delete_contact(id):
    pass