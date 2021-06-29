import Vue from './mixins';

import SearchField from './components/Elements/SearchField';
import LoadingModal from './components/Elements/LoadingModal';
import PdfExporter from './components/Elements/PdfExporter';

Vue.component('search-field', SearchField);
Vue.component('loading-modal', LoadingModal);
Vue.component('pdf', PdfExporter);

export default Vue;
