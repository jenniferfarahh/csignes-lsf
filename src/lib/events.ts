export const DASHBOARD_REFRESH_EVENT = "dashboard_refresh";

export function triggerDashboardRefresh() {
  window.dispatchEvent(new Event(DASHBOARD_REFRESH_EVENT));
}
