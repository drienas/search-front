import Vue from 'vue';
import Constants from './constants';

(function generateEndpoints() {
  let eps = {
    stammdaten: `${Constants.jr4}:${Constants.sd}`,
    esapi: `${Constants.jr4}:${Constants.esapi}`,
    pdf: `${Constants.pdf}`,
  };
  switch (Constants.mode) {
    case 'development':
      eps.esapi = `${Constants.edv}`;
      break;
  }
  Vue.prototype.$endpoints = eps;
})();

Vue.prototype.$wib = Constants.wib;
Vue.prototype.$version = require('../package.json').version;

Vue.prototype.$http = {
  async get(url) {
    let res = await fetch(url);
    let data;
    if (res.status === 200) {
      data = await res.json();
    }
    return { status: res.status, data };
  },
  async post(url, body) {
    body = JSON.stringify(body);
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    let data;
    if (res.status === 200) {
      data = await res.json();
    }
    return { status: res.status, data };
  },
};

Vue.prototype.$rheight = (win, el) => {
  let doc = win.document;
  const gs = (v) =>
    parseInt(
      doc.defaultView
        .getComputedStyle(doc.getElementById(el), '')
        .getPropertyValue(v)
    );
  return [0, 'height', 'margin-top', 'margin-bottom'].reduce(
    (a, b) => a + gs(b)
  );
};

Vue.prototype.$columns = async (id) => {
  return [];
  let data = await Vue.prototype.$http.get(
    `${Vue.prototype.$endpoints.stammdaten}/api/pdv/spalten/`
  );
  return data.status === 200
    ? data.data.filter((x) => x.pdv_definition_id === id)
    : [];
};

Vue.prototype.$isElectron =
  window.process &&
  window.process.versions &&
  window.process.versions.electron &&
  window.ipcRenderer;

// Vue.prototype.$openPopup = (size, url) => {};

Vue.prototype.$openExternal = (url) => {
  if (Vue.prototype.$isElectron) {
    window.ipcRenderer.invoke('openExternal', {
      url,
    });
  } else {
    window.open(url, '_blank');
  }
};

Vue.prototype.$openPopup = (url) => {
  if (Vue.prototype.$isElectron) {
    window.ipcRenderer.invoke('openPopup', {
      height: 800,
      width: 600,
      url: `${Constants.mainUrl}${url}`,
    });
  }
};

Vue.prototype.$elevatedUsers = Constants.elevatedUsers;

Vue.prototype.$ausstattungen = [
  'alarmanlage',
  'metallic',
  'huauneu',
  'scheckheft',
  'abs',
  'esp',
  'kurvenlicht',
  'nebelscheinwerfer',
  'tagfahrlicht',
  'traktionskontrolle',
  'wegfahrsperre',
  'zentralverriegelung',
  'elfensterheber',
  'elsitze',
  'panoramadach',
  'schiebedach',
  'servolenkung',
  'sitzheizung',
  'standheizung',
  'startstopp',
  'tempomat',
  'sportfahrwerk',
  'sportpaket',
  'sportsitze',
  'anhaengerkupplung',
  'dachreling',
  'skisack',
  'bordcomputer',
  'multifunktionslenkrad',
  'navi',
  'e10geeignet',
  'elseitenspiegel',
  'isofix',
  'partikelfilter',
  'lichtsensor',
  'regensensor',
  'nichtraucher',
  'markise',
  'luftfederung',
  'festbett',
  'scheibenbremse',
  'hagelschaden',
  'headupdisplay',
  'lederausstattung',
  'dachgepaecktraeger',
  'pflanzenoelgeeignet',
  'spurwechselassistent',
  'abstandstempomat',
  'keylessentry',
  'notbremsassistent',
  'spurhalteassistent',
  'sitzbelueftung',
  'metallicaussen',
  'standklimaanlage',
  'allradantrieb',
  'renaultgarantie',
  'daciagarantie',
  'seatgarantie',
  'sitzbelueftung',
  'abstandswarner',
  'allwetterreifen',
  'ambientebeleuchtung',
  'androidauto',
  'applecarplay',
  'armlehne',
  'beheizbarefrontscheibe',
  'beheizbareslenkrad',
  'berganfahrassistent',
  'blendfreiesfernlicht',
  'elektrheckklappe',
  'fernlichtassistent',
  'gepaeckraumabtrennung',
  'geschwindigkeitsbegrenzer',
  'induktionsladenfuersmartphones',
  'innenspiegelautomabblendend',
  'lederlenkrad',
  'lordosenstuetze',
  'massagesitze',
  'muedigkeitswarner',
  'musikstreamingintegriert',
  'nachtsichtassistent',
  'notrufsystem',
  'raucherpaket',
  'reifendruckkontrolle',
  'schaltwippen',
  'scheinwerferreinigung',
  'sitzheizunghinten',
  'sommerreifen',
  'sprachsteuerung',
  'totwinkelassistent',
  'touchscreen',
  'umklappbarerbeifahrersitz',
  'usb',
  'verkehrszeichenerkennung',
  'volldigitaleskombiinstrument',
  'winterpaket',
  'winterreifen',
  'wlanwifihotspot',
  'freisprecheinrichtung',
  'bluetooth',
  'cd_player',
  'pluginhybrid',
];

Vue.prototype.$standorte = [
  'AA - Zentrallagerplatz',
  'FIL - 02 - RD - Röhrsdorf',
  'FIL - 03 - BS - Burgstädt',
  'FIL - 04 - FB - Frankenberg',
  'FIL - 05 - OE - Oederan',
  'FIL - 06 - LH - Mittweida',
  'FIL - 07 - CH - Chemnitz',
  'FIL - 08 - BC - ChemnitzBC',
  'FIL - 09 - ZK - Zwickau',
  'FIL - 10 - HO - Hof-BC',
  'FIL - 11 - PL - Plauen',
  'FIL - 12 - HO - Hof LR',
  'FIL - 13 - ZS - ZwickauBC',
  'FIL - 13 - ZS - Lager',
  'FIL - 14 - FG - Freiberg',
  'FIL - 15 - PS - Plauen-SE',
];

Vue.prototype.$eigentuemer = [
  { value: 'Alle', key: 'Alle' },
  { value: 'RHRD', key: 'RHRD' },
  { value: 'RHBS', key: 'RHBS' },
  { value: 'RHFB', key: 'RHFB' },
  { value: 'RHOE', key: 'RHOE' },
  { value: 'RHLH', key: 'RHLH' },
  { value: 'RHCH', key: 'RHCH' },
  { value: 'RHBC', key: 'RHBC' },
  { value: 'RHPS', key: 'RHPS' },
  { value: 'RHZK', key: 'RHZK' },
  { value: 'RHZS', key: 'RHZS' },
  { value: 'RHPL', key: 'RHPL' },
  { value: 'RHHO', key: 'RHHO' },
  { value: 'RHFG', key: 'RHFG' },
  { value: 'BOCH', key: 'BOCH' },
  { value: 'BOZK', key: 'BOZK' },
  { value: 'BOHO', key: 'BOHO' },
];

Vue.prototype.$kraftstoff = [
  'Diesel',
  'Benzin',
  'Elektro',
  'LPG-Autogas',
  'Erdgas',
  'Wasserstoff',
  'Benzin+Elektro',
  'Diesel+Elektro',
  'Ethanol',
  'Benzin+Ethanol',
  'Diesel+Ethanol',
];

Vue.prototype.$getriebe = ['Automatik', 'Halbautomatik', 'Schaltgetriebe'];

export default Vue;
