from flask import Blueprint, request, jsonify
from models import db, Contact, User
from datetime import datetime


contacts_bp = Blueprint('contacts', __name__)

@contacts_bp.route('/contacts', methods=['GET'])
def get_contacts():
    pass





@contacts_bp.route('/<int:id>', methods=['GET'])
def get_contact(id):
    pass



@contacts_bp.route('/', methods=['POST'])
def create_contact():
    pass



@contacts_bp.route('/<int:id>', methods=['PATCH'])
def update_contact(id):
    pass




@contacts_bp.route('/<int:id>', methods=['DELETE'])
def delete_contact(id):
    pass