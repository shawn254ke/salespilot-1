from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Lead, Contact
from datetime import datetime

leads_bp = Blueprint('leads', __name__)

@leads_bp.route('/', methods=[GET])
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