/** Связка вкладки и панели для aria-controls / aria-labelledby */
export const getTabIds = (idPrefix: string, id: string) => ({
  tabId: `${idPrefix}-tab-${id}`,
  panelId: `${idPrefix}-panel-${id}`,
});
