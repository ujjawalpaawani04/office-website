"""add is_protected flag to team_members, mark the founding member protected

Revision ID: f1a2b3c4d5e6
Revises: e7ac351d16ab
Create Date: 2026-07-24 00:00:00.000000

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = 'f1a2b3c4d5e6'
down_revision = 'e7ac351d16ab'
branch_labels = None
depends_on = None


def upgrade():
    # Step 1: add the flag with a server_default so every existing row
    # backfills to not-protected in the same ALTER TABLE.
    with op.batch_alter_table('team_members', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('is_protected', sa.Boolean(), nullable=False, server_default=sa.false())
        )

    # Step 2: mark the founding member (lowest sort_order - Amit Singh,
    # Managing Director, seeded with sort_order=1) protected so the admin
    # panel can never edit, replace, or delete that record or move it out
    # of first position.
    connection = op.get_bind()
    team_members = sa.table(
        'team_members',
        sa.column('id', sa.Integer),
        sa.column('sort_order', sa.Integer),
        sa.column('is_protected', sa.Boolean),
    )
    first_member_id = connection.execute(
        sa.select(team_members.c.id).order_by(team_members.c.sort_order.asc()).limit(1)
    ).scalar()
    if first_member_id is not None:
        connection.execute(
            team_members.update().where(team_members.c.id == first_member_id).values(is_protected=True)
        )


def downgrade():
    with op.batch_alter_table('team_members', schema=None) as batch_op:
        batch_op.drop_column('is_protected')
