"""add service page content, SEO fields, and repeatable content tables

Revision ID: e7ac351d16ab
Revises: 7a3656399a72
Create Date: 2026-07-23 00:00:00.000000

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = 'e7ac351d16ab'
down_revision = '7a3656399a72'
branch_labels = None
depends_on = None


def upgrade():
    # Step 1: extend `services` with Hero/Overview/CTA/SEO singular fields,
    # group heading/intro text, and category/badge grouping. `category`
    # ships with a server_default so every existing row backfills to
    # 'our_services' in the same ALTER TABLE - no Python row-walk needed,
    # unlike the newsletter migration's per-row backfill (no per-row-unique
    # value is required here).
    with op.batch_alter_table('services', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'category',
                sa.Enum('our_services', 'corporate_specialised', name='service_category'),
                nullable=False,
                server_default='our_services',
            )
        )
        batch_op.add_column(sa.Column('badge_label', sa.String(length=40), nullable=True))

        batch_op.add_column(sa.Column('hero_breadcrumb_label', sa.String(length=160), nullable=True))
        batch_op.add_column(sa.Column('hero_title_prefix', sa.String(length=160), nullable=True))
        batch_op.add_column(sa.Column('hero_title_highlight', sa.String(length=160), nullable=True))
        batch_op.add_column(sa.Column('hero_description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('hero_background_media_id', sa.Integer(), nullable=True))

        batch_op.add_column(sa.Column('overview_tagline', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('overview_heading_prefix', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('overview_heading_highlight', sa.String(length=200), nullable=True))

        batch_op.add_column(sa.Column('cta_heading', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('cta_description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('cta_primary_label', sa.String(length=120), nullable=True))

        batch_op.add_column(sa.Column('seo_title', sa.String(length=220), nullable=True))
        batch_op.add_column(sa.Column('meta_description', sa.String(length=320), nullable=True))
        batch_op.add_column(sa.Column('meta_keywords', sa.String(length=300), nullable=True))
        batch_op.add_column(sa.Column('canonical_url', sa.String(length=300), nullable=True))
        batch_op.add_column(sa.Column('og_image_media_id', sa.Integer(), nullable=True))

        batch_op.add_column(sa.Column('features_tagline', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('features_heading_prefix', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('features_heading_highlight', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('features_intro', sa.Text(), nullable=True))

        batch_op.add_column(sa.Column('benefits_tagline', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('benefits_heading_prefix', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('benefits_heading_highlight', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('benefits_intro', sa.Text(), nullable=True))

        batch_op.add_column(sa.Column('process_intro', sa.Text(), nullable=True))

        batch_op.add_column(sa.Column('why_choose_us_intro', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('why_choose_us_image_media_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('why_choose_us_image_alt', sa.String(length=255), nullable=True))

        batch_op.add_column(sa.Column('industries_intro', sa.Text(), nullable=True))

        batch_op.create_foreign_key(
            batch_op.f('fk_services_hero_background_media_id_media'),
            'media', ['hero_background_media_id'], ['id'], ondelete='SET NULL',
        )
        batch_op.create_foreign_key(
            batch_op.f('fk_services_og_image_media_id_media'),
            'media', ['og_image_media_id'], ['id'], ondelete='SET NULL',
        )
        batch_op.create_foreign_key(
            batch_op.f('fk_services_why_choose_us_image_media_id_media'),
            'media', ['why_choose_us_image_media_id'], ['id'], ondelete='SET NULL',
        )
        batch_op.create_index(batch_op.f('ix_services_hero_background_media_id'), ['hero_background_media_id'])
        batch_op.create_index(batch_op.f('ix_services_og_image_media_id'), ['og_image_media_id'])
        batch_op.create_index(
            batch_op.f('ix_services_why_choose_us_image_media_id'), ['why_choose_us_image_media_id']
        )

    # Step 2: the 7 new child tables backing the repeatable, admin
    # add/remove/reorder-able content groups. Each mirrors `service_faqs`
    # exactly (id, service_id FK CASCADE, sort_order, no is_active - removal
    # from the array on save is the delete mechanism, same as FAQs today).
    op.create_table(
        'service_benefits',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('icon', sa.String(length=80), nullable=True),
        sa.Column('title', sa.String(length=160), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4', mysql_collate='utf8mb4_unicode_ci', mysql_engine='InnoDB',
    )
    op.create_table(
        'service_features',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('icon', sa.String(length=80), nullable=True),
        sa.Column('title', sa.String(length=160), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4', mysql_collate='utf8mb4_unicode_ci', mysql_engine='InnoDB',
    )
    op.create_table(
        'service_process_steps',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('icon', sa.String(length=80), nullable=True),
        sa.Column('title', sa.String(length=160), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4', mysql_collate='utf8mb4_unicode_ci', mysql_engine='InnoDB',
    )
    op.create_table(
        'service_why_choose_us',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('icon', sa.String(length=80), nullable=True),
        sa.Column('title', sa.String(length=160), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4', mysql_collate='utf8mb4_unicode_ci', mysql_engine='InnoDB',
    )
    op.create_table(
        'service_industries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('icon', sa.String(length=80), nullable=True),
        sa.Column('label', sa.String(length=160), nullable=False),
        sa.Column('blurb', sa.Text(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4', mysql_collate='utf8mb4_unicode_ci', mysql_engine='InnoDB',
    )
    op.create_table(
        'service_overview_paragraphs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4', mysql_collate='utf8mb4_unicode_ci', mysql_engine='InnoDB',
    )
    op.create_table(
        'service_overview_highlights',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('content', sa.String(length=300), nullable=False),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4', mysql_collate='utf8mb4_unicode_ci', mysql_engine='InnoDB',
    )

    for table in (
        'service_benefits', 'service_features', 'service_process_steps',
        'service_why_choose_us', 'service_industries',
        'service_overview_paragraphs', 'service_overview_highlights',
    ):
        with op.batch_alter_table(table, schema=None) as batch_op:
            batch_op.create_index(batch_op.f(f'ix_{table}_service_id'), ['service_id'])


def downgrade():
    # op.drop_table() removes the table's FK constraint and its backing
    # index together - dropping the index first (as a separate step) fails
    # on MySQL/InnoDB with "needed in a foreign key constraint", so each
    # table is just dropped outright, no prior drop_index call.
    for table in (
        'service_overview_highlights', 'service_overview_paragraphs',
        'service_industries', 'service_why_choose_us',
        'service_process_steps', 'service_features', 'service_benefits',
    ):
        op.drop_table(table)

    with op.batch_alter_table('services', schema=None) as batch_op:
        # FK constraints must be dropped before their backing index on
        # MySQL/InnoDB - dropping the index first fails with "needed in a
        # foreign key constraint" (same class of bug fixed above for the
        # child tables, just via drop_constraint instead of drop_table).
        batch_op.drop_constraint(batch_op.f('fk_services_why_choose_us_image_media_id_media'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_services_og_image_media_id_media'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_services_hero_background_media_id_media'), type_='foreignkey')
        batch_op.drop_index(batch_op.f('ix_services_why_choose_us_image_media_id'))
        batch_op.drop_index(batch_op.f('ix_services_og_image_media_id'))
        batch_op.drop_index(batch_op.f('ix_services_hero_background_media_id'))

        batch_op.drop_column('industries_intro')
        batch_op.drop_column('why_choose_us_image_alt')
        batch_op.drop_column('why_choose_us_image_media_id')
        batch_op.drop_column('why_choose_us_intro')
        batch_op.drop_column('process_intro')
        batch_op.drop_column('benefits_intro')
        batch_op.drop_column('benefits_heading_highlight')
        batch_op.drop_column('benefits_heading_prefix')
        batch_op.drop_column('benefits_tagline')
        batch_op.drop_column('features_intro')
        batch_op.drop_column('features_heading_highlight')
        batch_op.drop_column('features_heading_prefix')
        batch_op.drop_column('features_tagline')
        batch_op.drop_column('og_image_media_id')
        batch_op.drop_column('canonical_url')
        batch_op.drop_column('meta_keywords')
        batch_op.drop_column('meta_description')
        batch_op.drop_column('seo_title')
        batch_op.drop_column('cta_primary_label')
        batch_op.drop_column('cta_description')
        batch_op.drop_column('cta_heading')
        batch_op.drop_column('overview_heading_highlight')
        batch_op.drop_column('overview_heading_prefix')
        batch_op.drop_column('overview_tagline')
        batch_op.drop_column('hero_background_media_id')
        batch_op.drop_column('hero_description')
        batch_op.drop_column('hero_title_highlight')
        batch_op.drop_column('hero_title_prefix')
        batch_op.drop_column('hero_breadcrumb_label')
        batch_op.drop_column('badge_label')
        batch_op.drop_column('category')

    # MySQL has no standalone enum type to drop (it's inline on the column),
    # so dropping the column above is sufficient - no further cleanup needed.
