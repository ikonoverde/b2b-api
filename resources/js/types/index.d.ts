export interface User {
    id: number;
    name: string;
    email: string;
    initials: string;
    role: string;
}

export interface DetailedUser {
    id: number;
    name: string;
    email: string;
    rfc: string | null;
    phone: string | null;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    pm_type: string | null;
    pm_last_four: string | null;
}

export interface UserOrder {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    shipping_cost: number;
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
    product?: {
        slug: string;
    };
}

export interface UserActivity {
    total_orders: number;
    total_spent: number;
    last_order_date: string | null;
    account_age_days: number;
}

export interface ReorderUnavailableItem {
    product_id: number;
    product_name: string;
    reason: 'product_unavailable' | 'out_of_stock';
}

export interface ReorderPriceChange {
    product_id: number;
    product_name: string;
    original_price: number;
    current_price: number;
}

export interface ReorderWarnings {
    unavailable: ReorderUnavailableItem[];
    price_changes: ReorderPriceChange[];
}

export interface PageProps {
    auth: {
        user: User | null;
        canAccessAdmin: boolean;
    };
    adminNavigation: {
        ordersCount: number;
    } | null;
    miniCart: MiniCart | null;
    visitor: {
        showMeridaPromo: boolean;
    };
    flash: {
        success?: string;
        error?: string;
        password_status?: string;
        reorder_warnings?: ReorderWarnings;
    };
    [key: string]: unknown;
}

export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    image: string | null;
    price: number;
    quantity: number;
    subtotal: number;
}

export type MiniCartItem = Omit<CartItem, 'product_id'>;

export interface MiniCart {
    items: MiniCartItem[];
    subtotal: number;
    totalCount: number;
}

export interface CartTotals {
    subtotal: number;
    shipping: number | null;
    total: number | null;
}

export interface ShippingQuote {
    carrier: string;
    service: string;
    price: number;
    estimated_days: number;
    quote_id: string;
    rate_id: string;
}

export interface Cart {
    items: CartItem[];
    totals: CartTotals;
}

export interface ProductImage {
    id: number;
    url: string;
    position?: number;
}

export interface BreadcrumbItem {
    name: string;
    slug: string | null;
    url: string | null;
}

export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    sku: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    description: string | null;
    active_ingredients: string | null;
    recommendations: string | null;
    price: number;
    stock: number;
    is_active: boolean;
    weight_kg: number | null;
    width_cm: number | null;
    height_cm: number | null;
    depth_cm: number | null;
    images: ProductImage[];
    breadcrumbs: BreadcrumbItem[];
}

export interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
}

export interface CustomerProfile {
    orders_count: number;
    total_spent: number;
}

export interface Stat {
    label: string;
    value: string;
    change: string;
    positive: boolean | null;
    footer: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    featured?: boolean;
}

export interface Order {
    id: string;
    customer: string;
    initials: string;
    amount: string;
    status: 'Paid' | 'Pending';
}

export interface Activity {
    id: number;
    title: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error' | 'review';
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'low_stock';
    image: string | null;
    has_pending_orders?: boolean;
}

export interface AdminOrderCustomer {
    id: number;
    name: string;
    email: string;
}

export interface AdminOrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
}

export interface OrderStatusHistoryEntry {
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    admin_name: string | null;
    created_at: string;
}

export interface OrderNoteEntry {
    id: number;
    content: string;
    admin_name: string | null;
    created_at: string;
}

export interface AdminOrder {
    id: number;
    status: string;
    payment_status: string;
    payment_intent_id: string | null;
    total_amount: number;
    shipping_cost: number;
    refunded_amount: number;
    tracking_number: string | null;
    shipping_carrier: string | null;
    tracking_url: string | null;
    shipping_address: Record<string, string> | null;
    label_url: string | null;
    label_error: string | null;
    skydropx_shipment_id: string | null;
    shipping_quote_source: string | null;
    created_at: string;
    updated_at: string;
    customer: AdminOrderCustomer | null;
    shipping_method: { id: number; name: string } | null;
    items: AdminOrderItem[];
    status_histories: OrderStatusHistoryEntry[];
    notes: OrderNoteEntry[];
}

export interface AdminOrderListItem {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
    user: AdminOrderCustomer;
}

export interface OrderFilters {
    status: string;
    payment_status: string;
    date_from: string;
    date_to: string;
    customer: string;
    amount_min: string;
    amount_max: string;
    sort_by: string;
    sort_order: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    parent_id: number | null;
    display_order: number;
    children?: Category[];
    products_count?: number;
    depth?: number;
}

export interface PaymentMethodCard {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}

export interface PaymentMethod {
    id: string;
    type: string;
    card: PaymentMethodCard;
    is_default: boolean;
}

export interface Address {
    id: number;
    label: string;
    name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    phone: string | null;
    is_default: boolean;
    country: string;
    created_at: string;
    updated_at: string;
}

export interface AddressFormData {
    label: string;
    name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}

export interface BusinessItem {
    id: number;
    place_id: string;
    name: string;
    category_name: string | null;
    address: string | null;
    phone: string | null;
    website: string | null;
    google_maps_url: string | null;
    rating: number | null;
    reviews_count: number;
    city: string | null;
    state: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface BusinessScrapeRun {
    id: number;
    status: string;
    search_terms: string;
    location: string;
    total_found: number;
    total_imported: number;
    total_updated: number;
    error_message: string | null;
    started_at: string | null;
    completed_at: string | null;
}

export interface MeridaSampleRequestItem {
    id: number;
    business_name: string;
    contact_name: string;
    email: string;
    phone: string | null;
    business_type: string;
    client_volume: string;
    social_url: string | null;
    products_interested: string[];
    improvement_goals: string[];
    status: string;
    created_at: string;
    user: AdminOrderCustomer | null;
}

export interface AdProposalListItem {
    id: number;
    platform: 'meta' | 'google';
    name: string;
    objective: string;
    status: string;
    budget_amount: string | null;
    budget_period: string | null;
    currency: string;
    start_date: string | null;
    end_date: string | null;
    created_by_agent: boolean;
    created_at: string;
}

export interface AdProposalDetail extends AdProposalListItem {
    audience: string | null;
    geography: string | null;
    landing_page_url: string | null;
    offer: string | null;
    campaign_structure: Record<string, unknown> | null;
    ad_groups: unknown[] | null;
    keywords: unknown[] | null;
    negative_keywords: unknown[] | null;
    tracking_plan: Record<string, unknown> | null;
    success_metrics: Record<string, unknown> | null;
    assumptions: unknown[] | null;
    notes: string | null;
}

export interface AdProposalBrand {
    name: string;
    display_url: string;
    initial: string;
}

export type MetricProvenance = 'observed' | 'estimated' | 'unknown';

/**
 * A headline value is `number | null`, never `number | undefined`. Null means nobody observed it —
 * an unreachable account, a tool that never loaded. It is not zero, and it must never render as one.
 */
export interface MarketingReportListItem {
    id: number;
    reported_on: string;
    window_start: string | null;
    window_end: string | null;
    ga4_sessions: number | null;
    ga4_total_users: number | null;
    ga4_purchase_events: number | null;
    ig_followers: number | null;
    superseded_at: string | null;
    created_at: string;
}

export interface MarketingReportMetric {
    id: number;
    key: string;
    provenance: MetricProvenance;
    numeric_value: string | null;
    text_value: string | null;
    note: string | null;
}

export interface MarketingReportDetail {
    id: number;
    reported_on: string;
    window_start: string | null;
    window_end: string | null;
    ga4_property_id: string | null;
    body: string;
    agents_run: string[];
    reachability: Record<string, string>;
    compared_against: string[];
    superseded_at: string | null;
    created_at: string;
    metrics: MarketingReportMetric[];
}

export interface MarketingReportPreviousReading {
    id: number;
    reported_on: string;
    headlines: Record<string, number | null>;
}

export interface MetaAdCreative {
    primary_text: string | null;
    headline: string | null;
    description: string | null;
    cta: string;
    image_url: string | null;
    media_note: string | null;
}

export interface GoogleAdCreative {
    headlines: string[];
    descriptions: string[];
    display_url: string;
    path: string | null;
    sitelinks: string[];
    keywords: string[];
    ad_group: string | null;
}

export interface AdProposalPreview {
    platform: 'meta' | 'google';
    brand: AdProposalBrand;
    meta: MetaAdCreative[];
    google: GoogleAdCreative[];
}

export type SocialPlatform = 'facebook' | 'instagram';

/**
 * A draft is published only when Meta said so. `published_at` and `remote_post_id` arrive together
 * from a confirmed response, so a row carrying neither has never been posted, whatever else it says.
 * `publishing` is not a failure: it means we called Meta and never recorded an answer, and only a
 * human looking at the page can settle it.
 */
export type SocialPostStatus = 'pending' | 'publishing' | 'published' | 'rejected' | 'failed';

export interface SocialPostDraftListItem {
    id: number;
    platform: SocialPlatform;
    status: SocialPostStatus;
    caption: string;
    image_url: string | null;
    proposed_for: string | null;
    published_at: string | null;
    remote_permalink: string | null;
    reviewer: string | null;
    created_at: string | null;
}

export interface SocialPostDraftDetail extends SocialPostDraftListItem {
    image_path: string | null;
    link: string | null;
    rationale: string | null;
    brand_review: string | null;
    created_by_agent: boolean;
    reviewed_at: string | null;
    rejection_reason: string | null;
    remote_post_id: string | null;
    publish_error: string | null;
    requires_image: boolean;
    is_publishable: boolean;
}

export type GrowthTaskAgent =
    | 'content'
    | 'keywords'
    | 'paid-acquisition'
    | 'social-media'
    | 'generic'
    | 'human';

export type GrowthStatus = 'open' | 'done' | 'dropped';

/**
 * How a task was closed, and the two must never render the same.
 *
 * `report` means a marketing report observed the work landed, and the service checked that claim
 * against the metric. `human` means a person said so. They are different kinds of truth, and a single
 * green check over both is how a plan quietly stops distinguishing what was measured from what was
 * asserted.
 */
export type GrowthClosedBy = 'report' | 'human';

export interface GrowthTaskItem {
    id: number;
    slug: string;
    name: string;
    body: string;
    agent: GrowthTaskAgent;
    status: GrowthStatus;
    source_report: string | null;
    closed_at: string | null;
    closed_by: GrowthClosedBy | null;
    close_evidence: string | null;
    drop_reason: string | null;
    closure_proposed: boolean;
    closure_proposal_reason: string | null;
}

export interface GrowthActionItem {
    id: number;
    slug: string;
    name: string;
    summary: string | null;
    status: GrowthStatus;
    tasks: GrowthTaskItem[];
}

/**
 * The kanban columns, a reading of state the system already keeps: `todo` and `in_progress` split open
 * tasks by started_at, `review` is the open tasks awaiting a closure decision, `done` is the closed
 * ones. Dropped tasks appear on no column.
 */
export type GrowthBoardColumn = 'todo' | 'in_progress' | 'review' | 'done';

export interface GrowthBoardTask {
    id: number;
    slug: string;
    name: string;
    body: string;
    agent: GrowthTaskAgent;
    action: string;
    source_report: string | null;
    started_at: string | null;
    closed_by: GrowthClosedBy | null;
    close_evidence: string | null;
    closure_proposal_reason: string | null;
}

/**
 * One record an agent generated while executing a task — a blog draft, an ad proposal, a social post
 * draft. `url` is the artifact's own admin detail page, or null when it has none (e.g. banners).
 */
export interface GrowthTaskArtifact {
    type: string;
    label: string;
    title: string;
    url: string | null;
    created_at: string | null;
}

export interface GrowthTaskDetail {
    id: number;
    slug: string;
    name: string;
    body: string;
    agent: GrowthTaskAgent;
    action: string;
    status: GrowthStatus;
    column: GrowthBoardColumn | null;
    source_report: string | null;
    started_at: string | null;
    closed_at: string | null;
    closed_by: GrowthClosedBy | null;
    close_evidence: string | null;
    closure_proposed: boolean;
    closure_proposal_reason: string | null;
    drop_reason: string | null;
    artifacts: GrowthTaskArtifact[];
}

export interface ReportDetail {
    id: number;
    type: string;
    type_label: string;
    title: string;
    summary: string | null;
    body: string;
    agent: string | null;
    created_at: string | null;
}

export interface GrowthPaidGate {
    verdict: 'open' | 'closed';
    reason: string;
    preconditions: string[];
    decided_on: string;
}

export interface GrowthPlanRun {
    id: number;
    planned_on: string;
    source_report: string;
    paid_gate: 'open' | 'closed';
    created_actions_count: number;
    created_tasks_count: number;
}

export interface GrowthPlanDetail {
    id: number;
    planned_on: string;
    body: string;
    paid_gate: 'open' | 'closed';
    paid_gate_reason: string;
    paid_gate_preconditions: string[];
    created_at: string | null;
    source_report: { id: number; reported_on: string };
}

export interface GrowthTouchedTask {
    id: number;
    name: string;
    action_name: string;
    agent: GrowthTaskAgent;
    status: GrowthStatus;
    closure_proposed: boolean;
    created_here: boolean;
}
