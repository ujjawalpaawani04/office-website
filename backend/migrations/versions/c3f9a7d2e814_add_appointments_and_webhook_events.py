"""add appointments and webhook_events tables

Revision ID: c3f9a7d2e814
Revises: f1a2b3c4d5e6
Create Date: 2026-07-31 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c3f9a7d2e814'
down_revision = 'f1a2b3c4d5e6'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'appointments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('appointment_id', sa.String(length=20), nullable=False),
        sa.Column('calendly_event_uri', sa.String(length=255), nullable=True),
        sa.Column('calendly_invitee_uri', sa.String(length=255), nullable=True),
        sa.Column('client_name', sa.String(length=120), nullable=False),
        sa.Column('mobile_number', sa.String(length=10), nullable=False),
        sa.Column('email', sa.String(length=190), nullable=False),
        sa.Column('business_name', sa.String(length=160), nullable=True),
        sa.Column('is_existing_client', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('alternate_contact', sa.String(length=10), nullable=True),
        sa.Column('service', sa.String(length=40), nullable=False),
        sa.Column(
            'meeting_mode',
            sa.Enum('office', 'phone', 'video', name='appointment_meeting_mode'),
            nullable=False,
        ),
        sa.Column('appointment_date', sa.Date(), nullable=False),
        sa.Column('appointment_time', sa.Time(), nullable=False),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('requirement_description', sa.Text(), nullable=False),
        sa.Column('consent_given', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('document_filename', sa.String(length=255), nullable=True),
        sa.Column('document_path', sa.String(length=500), nullable=True),
        sa.Column('document_mime_type', sa.String(length=100), nullable=True),
        sa.Column('document_size_bytes', sa.Integer(), nullable=True),
        sa.Column(
            'status',
            sa.Enum(
                'pending_confirmation', 'confirmed', 'cancelled', 'completed', 'failed',
                name='appointment_status',
            ),
            nullable=False,
            server_default='pending_confirmation',
        ),
        sa.Column('meeting_link', sa.Text(), nullable=True),
        sa.Column('cancel_url', sa.Text(), nullable=True),
        sa.Column('reschedule_url', sa.Text(), nullable=True),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4',
        mysql_collate='utf8mb4_unicode_ci',
        mysql_engine='InnoDB',
    )
    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_appointments_appointment_id'), ['appointment_id'], unique=True)
        batch_op.create_index(batch_op.f('ix_appointments_calendly_event_uri'), ['calendly_event_uri'], unique=True)
        batch_op.create_index(
            batch_op.f('ix_appointments_calendly_invitee_uri'), ['calendly_invitee_uri'], unique=True
        )
        batch_op.create_index(batch_op.f('ix_appointments_mobile_number'), ['mobile_number'], unique=False)
        batch_op.create_index(batch_op.f('ix_appointments_email'), ['email'], unique=False)
        batch_op.create_index(batch_op.f('ix_appointments_service'), ['service'], unique=False)
        batch_op.create_index(batch_op.f('ix_appointments_appointment_date'), ['appointment_date'], unique=False)
        batch_op.create_index(batch_op.f('ix_appointments_status'), ['status'], unique=False)

    op.create_table(
        'webhook_events',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('provider', sa.String(length=40), nullable=False, server_default='calendly'),
        sa.Column('external_id', sa.String(length=190), nullable=False),
        sa.Column('event_type', sa.String(length=80), nullable=False),
        sa.Column('payload', sa.JSON(), nullable=True),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4',
        mysql_collate='utf8mb4_unicode_ci',
        mysql_engine='InnoDB',
    )
    with op.batch_alter_table('webhook_events', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_webhook_events_external_id'), ['external_id'], unique=True)


def downgrade():
    with op.batch_alter_table('webhook_events', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_webhook_events_external_id'))
    op.drop_table('webhook_events')

    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_appointments_status'))
        batch_op.drop_index(batch_op.f('ix_appointments_appointment_date'))
        batch_op.drop_index(batch_op.f('ix_appointments_service'))
        batch_op.drop_index(batch_op.f('ix_appointments_email'))
        batch_op.drop_index(batch_op.f('ix_appointments_mobile_number'))
        batch_op.drop_index(batch_op.f('ix_appointments_calendly_invitee_uri'))
        batch_op.drop_index(batch_op.f('ix_appointments_calendly_event_uri'))
        batch_op.drop_index(batch_op.f('ix_appointments_appointment_id'))
    # MySQL ENUM columns are inline column types, not separate DB objects
    # (unlike Postgres), so dropping the table is sufficient cleanup - no
    # DROP TYPE step needed.
    op.drop_table('appointments')
