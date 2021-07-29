import Vue from './mixins';

import SearchField from './components/Elements/SearchField';
import LoadingModal from './components/Elements/LoadingModal';
import PdfExporter from './components/Elements/PdfExporter';
import SchneiderLogo from './components/Elements/SchneiderLogo';
import LoginData from './components/Elements/LoginData';

Vue.component('search-field', SearchField);
Vue.component('loading-modal', LoadingModal);
Vue.component('pdf', PdfExporter);
Vue.component('schneidergruppe', SchneiderLogo);
Vue.component('logindata', LoginData);

export default Vue;
