"""add email change otps table

Revision ID: c8e1f4a9b2d7
Revises: a4f7e9c21b3d
Create Date: 2026-08-13 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8e1f4a9b2d7'
down_revision = 'a4f7e9c21b3d'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('email_change_otps',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('admin_id', sa.Integer(), nullable=False),
    sa.Column('new_email', sa.String(length=190), nullable=False),
    sa.Column('otp_hash', sa.String(length=255), nullable=False),
    sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('attempts', sa.Integer(), nullable=False),
    sa.Column('used_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['admin_id'], ['admins.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    mysql_charset='utf8mb4',
    mysql_collate='utf8mb4_unicode_ci',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('email_change_otps', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_email_change_otps_admin_id'), ['admin_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_email_change_otps_expires_at'), ['expires_at'], unique=False)


def downgrade():
    with op.batch_alter_table('email_change_otps', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_email_change_otps_expires_at'))
        batch_op.drop_index(batch_op.f('ix_email_change_otps_admin_id'))

    op.drop_table('email_change_otps')
