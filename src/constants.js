export default {
  mode: process.env.VUE_APP_MODE || null,
  pdf: process.env.VUE_APP_PDF_EXPORT || null,
  esapi: process.env.VUE_APP_ES_API || null,
  sd: process.env.VUE_APP_STAMMDATEN || null,
  mainUrl: process.env.VUE_APP_MAIN || null,
  wib: process.env.VUE_APP_WIB || null,
  remote: process.env.VUE_APP_ISREMOTE || false,
  elevatedUsers: ['C745', 'C193', 'A999'],
};
