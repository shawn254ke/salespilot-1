from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Lead, Contact
from datetime import datetime

leads_bp = Blueprint('leads', __name__)

@leads_bp.route('/', methods=['GET'])
@jwt_required()
def get_leads():
    current_user_id = get_jwt_identity()
    
    lead = Lead.query.get_or_404(id)
    
    contact = Contact.query.get_or_404(lead.contact_id)
    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to lead'}), 403
    
    return jsonify({
        'id': lead.id,
        'contact_id': lead.contact_id,
        'status':lead.status,
        'created_at': lead.created_at.isoformat()
    }), 200
    
@leads_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_lead(id):
    current_user_id = get_jwt_identity()
    
    lead = Lead.query.get_or_404(id)
    
    contact = Contact.query.get_or_404(lead.contact_id)
    if contact.user_id != current_user_id:
        return jsonify({'error':'Unauthorized access to lead'}), 403
    
    return jsonify({
        'id': lead.id,
        'contact_id':lead.contact_id,
        'status': lead.status,
        'created_at': lead.created_at.isoformat()
    }), 200
    
@leads_bp.route('/', methods=['POST'])
@jwt_required()
def create_lead():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['name', 'email', 'status']
    if not all(field in data for field in required_fields):
        return jsonify({'error': f'Required fields: {", ".join(required_fields)}'}), 400
    
    allowed_statuses = ['New', 'Contacted', 'Interested', 'Converted', 'Lost']
    if data['status'] not in allowed_statuses:
        return jsonify({'error': f'status must be one of: {", ".join(allowed_statuses)}'}), 400
    
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
        db.session.flush()  
        
        new_lead = Lead(
            contact_id=new_contact.id,
            status=data['status'],
            created_at=datetime.utcnow()
        )
        db.session.add(new_lead)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Lead created successfully',
            'lead_id': new_lead.id,
            'contact_id': new_contact.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@leads_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_lead(id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    lead = Lead.query.get_or_404(id)
    
    contact = Contact.query.get_or_404(lead.contact_id)
    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to lead'}), 403
    
    if 'status' in data:
        allowed_statuses = ['New', 'Contacted', 'Interested', 'Converted', 'Lost']
        if data['status'] not in allowed_statuses:
            return jsonify({'error': f'status must be one of: {", ".join(allowed_statuses)}'}), 400
        lead.status = data['status']
        
    try:
        db.session.commit()
        return jsonify({'message': 'Lead updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@leads_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_lead(id):
    current_user_id = get_jwt_identity()
    
    lead = Lead.query.get_or_404(id)
    
    contact = Contact.query.get_or_404(lead.contact_id)
    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to lead'}), 403
    
    try:
        db.session.delete(lead)
        db.session.commit()
        return jsonify({'message': 'Lead deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400