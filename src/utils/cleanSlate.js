/**
 * Automatically purges legacy demo data, sample images, and pre-entered records
 * from browser's localStorage to ensure a 100% natural development clean slate.
 */
export function initializeCleanSlate() {
    try {
        const CLEAN_SLATE_KEY = "leaf_clay_v3_clean_slate_active";
        if (!localStorage.getItem(CLEAN_SLATE_KEY)) {
            const legacyKeysToRemove = [
                "leaf_clay_products_v1",
                "leaf_clay_products_v2",
                "leaf_clay_categories_v1",
                "leaf_clay_categories_v2",
                "leaf_clay_orders_v1",
                "leaf_clay_coupons_v1",
                "leaf_clay_messages_v1",
                "leaf_clay_settings_v1",
                "leaf_clay_cart",
                "leaf_clay_users_v2",
                "leaf_clay_current_user_v2",
                "leaf_clay_admin_auth_v1"
            ];
            legacyKeysToRemove.forEach((key) => {
                try {
                    localStorage.removeItem(key);
                } catch {
                    // Ignore storage errors
                }
            });
            localStorage.setItem(CLEAN_SLATE_KEY, "true");
        }
    } catch (e) {
        console.error("Clean slate initialization error", e);
    }
}
