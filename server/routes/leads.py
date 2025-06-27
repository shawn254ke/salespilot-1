from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Lead, Contact
from datetime import datetime

leads_bp = Blueprint('leads', __name__)

ALLOWED_STATUSES = ['New', 'Contacted', 'Interested', 'Converted', 'Lost']

@leads_bp.route('/', methods=['GET'])
@jwt_required()
def get_leads():
    """Get all leads for the current user"""
    current_user_id = get_jwt_identity()
    
    contacts = Contact.query.filter_by(user_id=current_user_id).all()
    contact_ids = [contact.id for contact in contacts]
    
    leads = Lead.query.filter(Lead.contact_id.in_(contact_ids)).all()
    
    return jsonify([{
        'id': lead.id,
        'contact_id': lead.contact_id,
        'status': lead.status,
        'created_at': lead.created_at.isoformat(),
        'contact': {
            'name': next((c.name for c in contacts if c.id == lead.contact_id), None),
            'email': next((c.email for c in contacts if c.id == lead.contact_id), None),
            'company': next((c.company for c in contacts if c.id == lead.contact_id), None)
        }
    } for lead in leads]), 200

@leads_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_lead(id):
    """Get a specific lead by ID"""
    current_user_id = get_jwt_identity()
    
    lead = Lead.query.get_or_404(id)
    contact = Contact.query.get_or_404(lead.contact_id)
    
    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to lead'}), 403
    
    return jsonify({
        'id': lead.id,
        'contact_id': lead.contact_id,
        'status': lead.status,
        'created_at': lead.created_at.isoformat(),
        'contact': {
            'name': contact.name,
            'email': contact.email,
            'phone': contact.phone,
            'company': contact.company
        }
    }), 200

@leads_bp.route('/', methods=['POST'])
@jwt_required()
def create_lead():
    """Create a new lead with associated contact"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['name', 'email', 'status']
    if not all(field in data for field in required_fields):
        return jsonify({
            'error': 'Missing required fields',
            'required': required_fields,
            'received': list(data.keys())
        }), 400
    

    if data['status'] not in ALLOWED_STATUSES:
        return jsonify({
            'error': 'Invalid status',
            'allowed_statuses': ALLOWED_STATUSES
        }), 400
    
    
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
            'contact_id': new_contact.id,
            'status': new_lead.status
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to create lead',
            'details': str(e)
        }), 400

@leads_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_lead(id):
    """Update lead status"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    lead = Lead.query.get_or_404(id)
    contact = Contact.query.get_or_404(lead.contact_id)
    
    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to lead'}), 403
    
    if 'status' in data:
        if data['status'] not in ALLOWED_STATUSES:
            return jsonify({
                'error': 'Invalid status',
                'allowed_statuses': ALLOWED_STATUSES
            }), 400
        lead.status = data['status']
    else:
        return jsonify({
            'error': 'No fields to update',
            'hint': 'Only status can be updated via this endpoint'
        }), 400
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Lead updated successfully',
            'new_status': lead.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to update lead',
            'details': str(e)
        }), 400

@leads_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_lead(id):
    """Delete a lead"""
    current_user_id = get_jwt_identity()
    
    lead = Lead.query.get_or_404(id)
    contact = Contact.query.get_or_404(lead.contact_id)
    
    if contact.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to lead'}), 403
    
    try:
        db.session.delete(lead)
        db.session.commit()
        return jsonify({
            'message': 'Lead deleted successfully',
            'deleted_lead_id': id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to delete lead',
            'details': str(e)
        }), 400

@leads_bp.route('/status-options', methods=['GET'])
@jwt_required()
def get_status_options():
    """Get all allowed status options"""
    return jsonify({
        'status_options': ALLOWED_STATUSES
    }), 200