const { ref, computed } = Vue;

const DC_BASE = "extension/module/distribution_center";

const ICON_HOME = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"></path><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"></path></svg>`;

const ICON_OVERDUE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>`;

const ICON_ADVANCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"></path><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"></path></svg>`;

const ICON_REVERT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm5.845 17.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V12a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clip-rule="evenodd"></path><path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z"></path></svg>`;

function userTokenFromLocation() {
  return new URLSearchParams(window.location.search).get("user_token") || "";
}

function mergeSearchParams(params) {
  const sp = new URLSearchParams();
  const token = userTokenFromLocation();
  if (token) {
    sp.set("user_token", token);
  }
  if (!params) {
    return sp;
  }
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    sp.set(key, String(value));
  }
  return sp;
}

/**
 * OpenCart admin URLs for Distribution Center pages and APIs.
 * @param {string} [route=''] — DC method name, empty for DC home, or full route when absolute is true
 * @param {Record<string, string|number>} [params={}]
 * @param {boolean} [absolute=false] — use route as a full `route=` path (e.g. common/logout)
 */
function getRoute(route = "", params = {}, absolute = false) {
  const path = absolute
    ? route
    : route
      ? `${DC_BASE}/${route}`
      : DC_BASE;
  const sp = mergeSearchParams(params);
  const qs = sp.toString();
  return qs ? `index.php?route=${path}&${qs}` : `index.php?route=${path}`;
}

export function useDc() {
  const totalOverdue = ref(0);
  const totalRevert = ref(0);
  const totalPickup = ref(0);
  const totalNew = ref(0);

  const sideMenus = computed(() => [
    {
      label: "Home",
      icon: ICON_HOME,
      total: totalNew.value,
      event: () => {
        window.location.href = getRoute();
      },
    },
    {
      label: "Overdue Orders",
      icon: ICON_OVERDUE,
      total: totalOverdue.value,
      event: () => {
        window.location.href = getRoute("overdue");
      },
    },
    {
      label: "Advance Orders",
      icon: ICON_ADVANCE,
      total: 0,
      event: () => {
        window.location.href = getRoute("advance");
      },
    },
    {
      label: "Revert Orders",
      icon: ICON_REVERT,
      total: totalRevert.value,
      event: () => {
        window.location.href = getRoute("revertOrders");
      },
    },
  ]);

  return {
    sideMenus,
    totalOverdue,
    totalRevert,
    totalPickup,
    totalNew,
    getRoute,
  };
}
