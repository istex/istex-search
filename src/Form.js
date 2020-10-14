/* eslint-disable no-restricted-properties */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable global-require */
/* eslint-disable react/sort-comp */
/* eslint-disable one-var */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable no-trailing-spaces */
import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';
// import Textarea from 'react-textarea-autosize';
import {
    Modal, Button, OverlayTrigger, Popover,
    Tooltip, FormGroup, FormControl,
    Radio, InputGroup, Nav, NavItem,
} from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import decamelize from 'decamelize';
import qs from 'qs';
import commaNumber from 'comma-number';
import md5 from 'md5';
import 'react-input-range/lib/css/index.css';
import autosize from 'autosize';
import Filetype from './Filetype';
import StorageHistory from './storageHistory';
import Labelize from './i18n/fr';


import config from './config';
// https://trello.com/c/XXtGrIQq/157-2-longueur-de-requ%C3%AAte-max-tester-limites-avec-chrome-et-firefox
export const characterLimit = config.characterLimit;
export const nbHistory = 30;

export default class Form extends React.Component {
    static handleReload() {
        if (JSON.parse(window.localStorage.getItem('dlISTEXlastUrl'))) {
            window.location = JSON.parse(window.localStorage.getItem('dlISTEXlastUrl'));
        }
    }

    static handleCopy() {
        NotificationManager.info('Le lien a été copié dans le presse-papier', '', 2000);
    }


    constructor(props) {
        super(props);
        this.defaultState = {
            q: '',
            querywithIDorARK: '',
            qId: '',
            size: config.defaultSize,
            limitNbDoc: config.limitNbDoc,
            extractMetadata: false,
            extractFulltext: false,
            extractEnrichments: false,
            extractCovers: false,
            extractAnnexes: false,
            downloading: false,
            showWarningMissingDocs:false,
            URL2Download: '',
            errorRequestSyntax: '',
            errorDuringDownload: '',
            rankBy: 'qualityOverRelevance',
            total: 0,
            activeKey: '1',
            nbDocsCalculating: false,
            compressionLevel: 6,
            archiveType: 'zip',
            samples: [],
            archiveSize: '--',
            downloadBtnClass: 'text-default',
            queryType: '',
            uploadTxt: '',
            dotCorpusidCount: 0,
        };
        this.state = this.defaultState;
        this.child = [];
        this.timer = 0;
        this.lastqId = '';
        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFiletypeChange = this.handleFiletypeChange.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlerankByChange = this.handlerankByChange.bind(this);
        this.handleArchiveTypeChange = this.handleArchiveTypeChange.bind(this);
        this.isDownloadDisabled = this.isDownloadDisabled.bind(this);
        this.interpretURL = this.interpretURL.bind(this);
        this.recoverFormatState = this.recoverFormatState.bind(this);
        this.hideModalShare = this.hideModalShare.bind(this);
        this.hideModalExemple = this.hideModalExemple.bind(this);
        this.calculateNbDocs = this.calculateNbDocs.bind(this);
        this.shouldHideUpersonnalise = 'hidden';
        this.shouldHideU = 'col-lg-12 col-sm-12 usages';
        this.usage = false;
        this.loadexUsageLabel = 'Choisir cet usage';
        this.persUsageLabel = 'Choisir cet usage';
        this.selectedPersClass = '';
        this.selectedLodexClass = '';
        this.limitNbDocClass = 'limitNbDocTxtHide';
        this.showSamplesDiv = false;
        this.showEstimatedSizeTxtClass = 'hidden';
        this.handleClChange = this.handleClChange.bind(this);
        this.showDownloadCorpusBtn = 'false';
        this.handleQChange = false;
        this.showSamplesLoader = false;
        this.textAreaRowsLength = 1;
        this.nbDocsFound = 0;
        this.queryNbLines = 0;
        this.warningBadDocCountAlreadyDisplayed = false;
    }

    componentWillMount() {
        const url = document.location.href;
        const shortUrl = url.slice(url.indexOf('?') + 1);
        this.interpretURL(shortUrl);
    }

    componentDidMount() {
        this.recoverFormatState();
        this.textarea.focus();
        autosize(this.textarea);
    }

    recoverFormatState() {
        const self = this;
        this.child.forEach((type) => {
            type.child.forEach((format) => {
                if (format.state[format.props.format]) {
                    self.setState({
                        [format.state.name]: true,
                    });
                }
            });
        });
    }

    hideModalShare() {
        this.setState({
            showModalShare: false,
        });
    }

    hideModalExemple() {
        this.setState({
            showModalExemple: false,
        });
    }

    getSamplesList() {
        const self = this;
        const ISTEX = this.state.activeKey === '1'
            ? this.buildURLFromState(this.state.q, false, false)
            : this.buildURLFromState(this.transformIdListToQuery(), false, false);
        ISTEX.searchParams.delete('extract');
        ISTEX.searchParams.delete('withID');
        if (this.istexDlXhr) {
            this.istexDlXhr.abort();
        }
        ISTEX.searchParams.set('queryType', this.state.queryType);

        // disable all before getting total 
        this.istexDlXhr = $.post(ISTEX.href + '&output=title,host.title,publicationDate,author,arkIstex&size=6', { qString: this.state.activeKey === '1' ? this.state.q : this.transformIdListToQuery() })
            .done((json) => {
                // this.state.samples = json.hits;
                return this.setState({
                    samples: json.hits,
                });
            }).fail((err) => {
                if (err.status >= 500) {
                    return self.setState({ errorServer: 'Error server TODO ...' });
                }
                if (err.status >= 400 && err.status < 500) {
                    return this.setState({ errorRequestSyntax: err.responseJSON._error });
                }
                return null;
            })
            .always(() => {
                this.istexDlXhr = null;
            });
    }

    selectAllDocs() {
        this.setState({ size: this.state.limitNbDoc });
    }

    selectAllActiveClass() {
        return (this.state.size === this.state.limitNbDoc && this.state.size !== 0) ? 'active' : '';
    }

    calculateNbDocs(defaultSize, queryChanged) {
        let sizeParam;
        if (defaultSize == null) {
            sizeParam = config.defaultSize;
        } else {
            sizeParam = defaultSize;
        }
        this.setState({
            nbDocsCalculating: true,
            total: 0,
            size: 0,
        });
        const self = this;
        const ISTEX = this.state.activeKey === '1'
            ? this.buildURLFromState(this.state.q, false, queryChanged)
            : this.buildURLFromState(this.transformIdListToQuery(), false, queryChanged);
        ISTEX.searchParams.delete('extract');
        ISTEX.searchParams.delete('withID');
        if (this.istexDlXhr) {
            this.istexDlXhr.abort();
        }
        ISTEX.searchParams.set('queryType', this.state.queryType);

        // disable all before getting total 
        this.istexDlXhr = $.post(
            ISTEX.href + '&output=title,host.title,publicationDate,author,arkIstex&size=6',
            { qString: this.state.activeKey === '1' ? this.state.q : this.transformIdListToQuery() }
        ).done((json) => {
                const { total } = json;
                let size,
                    limitNbDoc = config.limitNbDoc;
                this.warningBadDocCountAlreadyDisplayed = false;
                if (!total || total === 0) {
                    size = 0;
                    limitNbDoc = 0;
                    this.nbDocsFound = 0;
                } else if (sizeParam <= config.limitNbDoc) {
                    if (sizeParam > total) {
                        size = total;
                    } else {
                        size = sizeParam;
                    }
                } else {
                    size = config.limitNbDoc;
                }
                if (total < sizeParam) {
                    size = total;
                    limitNbDoc = total;
                }

                if (total > 0) {
                    this.limitNbDocClass = 'limitNbDocTxt';
                    this.nbDocsFound = total;
                }

                return this.setState({
                    samples: json.hits,
                    size,
                    total: total || 0,
                    limitNbDoc,
                    nbDocsCalculating: false,
                });
            }).fail((err) => {
                if (err.status >= 500) {
                    return self.setState({ errorServer: 'Error server TODO ...' });
                }
                if (err.status >= 400 && err.status < 500) {
                    return this.setState({ errorRequestSyntax: err.responseJSON._error });
                }
                return null;
            },
            )
            .always(() => {
                this.istexDlXhr = null;
            });
    }

    transformIdListToQuery() {
        if (!this.state.querywithIDorARK) return '';

        let res;
        if (this.state.querywithIDorARK.includes('ark')) {
            this.state.queryType = 'querywithARK';
            if (this.state.querywithIDorARK.startsWith('arkIstex.raw:')) {
                res = this.state.querywithIDorARK;
            } else {
                res = 'arkIstex.raw:'
                    .concat('("')
                    .concat(this.state.querywithIDorARK)
                    .concat('")');
                res = res.replace(new RegExp(/\s+/, 'g'), '" "');
            }
        } else {
            this.state.queryType = 'querywithID';
            if (this.state.querywithIDorARK.startsWith('id:')) {
                res = this.state.querywithIDorARK;
            } else {
                res = 'id:('
                    .concat(this.state.querywithIDorARK.match(new RegExp(`.{1,${40}}`, 'g')))
                    .concat(')')
                    .replace(new RegExp(',', 'g'), ' ');
            }
        }
        return res;
    }

    static getIdListFromQuery(booleanQuery) {
        let idArray;
        if (booleanQuery.startsWith('arkIstex.raw:')) {
            idArray = booleanQuery.match(/ark:\/[0-9]{5}\/\w{3}-\w{8}-\w/g);
        } else {
            idArray = booleanQuery.match(/[0-9A-F]{40}/gi);
        }
        return (idArray === null || idArray.length <= 0) ? '' : idArray.join('\n');
    }


    setQIDFromURL(parsedUrl) {
        this.lastqId = parsedUrl.q_id;
        this.setState({
            q: parsedUrl.withID ? '' : (parsedUrl.q || ''),
            querywithIDorARK: parsedUrl.withID ? parsedUrl.q : '',
        }, () => this.calculateNbDocs(parsedUrl.size, true));
    }

    // eslint-disable-next-line class-methods-use-this
    characterNumberValidation() {
        return 'success';
    }

    setStateFromURL(parsedUrl) {
        this.lastqId = parsedUrl.q_id;
        if (parsedUrl.q_id == undefined) {
            parsedUrl.q_id = '';
        }
        if (parsedUrl.withID == ('true') && parsedUrl.q && parsedUrl.q.indexOf(':(') > 0) {
            parsedUrl.q = Form.getIdListFromQuery(parsedUrl.q);
        }
        this.setState({
            q: parsedUrl.withID ? '' : (parsedUrl.q || ''),
            querywithIDorARK: parsedUrl.withID ? parsedUrl.q : '',
            size: parsedUrl.size || config.defaultSize,
            limitNbDoc: config.limitNbDoc,
            extractMetadata: false,
            extractFulltext: false,
            extractEnrichments: false,
            qId: parsedUrl.q_id,
            extractCovers: (parsedUrl.extract && parsedUrl.extract.includes('covers')) || false,
            extractAnnexes: (parsedUrl.extract && parsedUrl.extract.includes('annexes')) || false,
            downloading: !!parsedUrl.download,
            URL2Download: '',
            errorRequestSyntax: '',
            errorDuringDownload: '',
            rankBy: parsedUrl.rankBy || 'qualityOverRelevance',
            compressionLevel: parsedUrl.compressionLevel || 6,
            activeKey: parsedUrl.withID ? '2' : '1',
            total: 0,
            archiveType: parsedUrl.archiveType || 'zip',
            uploadTxt: '',

        }, () => this.calculateNbDocs(parsedUrl.size, true));
        if (parsedUrl.extract) {
            parsedUrl.extract.split(';').forEach((filetype) => {
                const type = filetype.charAt(0).toUpperCase().concat(filetype.slice(1, filetype.indexOf('[')));
                const formats = filetype.slice(filetype.indexOf('[') + 1, filetype.indexOf(']')).split(',');
                let res = '';
                formats.forEach((format) => {
                    res += `${format},`;
                });
                res = res.slice(0, res.length - 1);
                this.setState({
                    [type]: res,
                }, () => {
                    if (parsedUrl.download) {
                        this.handleSubmit(new Event('submit'));
                    }
                });
            });
        }
        if (parsedUrl.q) {
            this.textAreaRowsLength = parsedUrl.q.split('\n').length;
        }
    }

    interpretURL(url) {
        const parsedUrl = qs.parse(url);
        if (parsedUrl.usage === '1') {
            this.usage = 1;
            this.selectedLodexClass = '';
            this.shouldHideUpersonnalise = ' ';
            this.shouldHideU = 'hidden';
            this.persUsageLabel = 'usage sélectionné';
            this.loadexUsageLabel = 'choisir cet usage';
            this.selectedPersClass = 'selectedUsage';
        } else if (parsedUrl.usage === '2') {
            this.usage = 2;
            this.selectedPersClass = '';
            this.selectedLodexClass = 'selectedUsage';
            this.loadexUsageLabel = 'usage sélectionné';
            this.persUsageLabel = 'choisir cet usage';
        }
        if (parsedUrl.q_id !== undefined) {
            // check session
            let qSessionStorage = sessionStorage.getItem(parsedUrl.q_id);
            if (qSessionStorage !== null) {
                parsedUrl.q = qSessionStorage;
                this.setStateFromURL(parsedUrl);
            } else {
                fetch(new URL(`${config.apiUrl}/q_id/${parsedUrl.q_id}`))
                    .then(response => response.json()).then((data) => {
                        parsedUrl.q = data.req;
                        this.setQIDFromURL(parsedUrl);
                        this.setStateFromURL(parsedUrl);
                    });
            }
        } else if (Object.keys(parsedUrl).length >= 1) {
            this.setStateFromURL(parsedUrl);
        }
    }

    waitRequest(queryChanged) {
        if (this.state.q.length > 0 || this.state.querywithIDorARK.length > 0) {
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
            this.timer = window.setTimeout(() => { this.calculateNbDocs(null, queryChanged); }, 800);
        } else {
            this.setState({
                size: 0,
                total: 0,
            });
        }
    }

    handleQueryChange(event) {
        if (event) {
            this.handleQChange = true;
            if (this.state.activeKey === '1') {
                this.setState({
                    errorRequestSyntax: '',
                    q: event.query || event.target.value,
                }, () => this.waitRequest(true));
            } else {
                // let userQuery = (event.query || event.target.value);
                // let idsArray = userQuery.match(/^ark:\/67375\/[0-9A-Z]{3}-[0-9A-Z]{8}-[0-9A-Z]$/gm);
                // if (!idsArray) idsArray = userQuery.match(/^[0-9A-F]{40}$/gm);                
                // const goodQuery = (idsArray && idsArray.length > 0) ? idsArray.join('\n') : '';
                const goodQuery = (event.query || event.target.value);

                this.setState({
                    errorRequestSyntax: '',
                    querywithIDorARK: goodQuery,
                }, () => this.waitRequest(true));
            }     
        } else {
            this.setState({
                errorRequestSyntax: '',
            }, () => this.waitRequest(false));
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type && target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value,
        });
    }

    handleFiletypeChange(filetypeEvent) {
        const { filetype, value } = filetypeEvent;
        const name = 'extract'.concat(filetype.charAt(0).toUpperCase()).concat(filetype.slice(1));
        this.setState({
            [name]: value,
        });
    }

    handlerankByChange(rankByEvent) {
        const target = rankByEvent.target;
        const name = target.name;
        if (this.state.total > 0) {
            this.showSamplesLoader = true;
        }
        this.setState({
            rankBy: name,
            samples: '',
        }, () => this.getSamplesList());
    }

    handleArchiveTypeChange(archiveFormatEvent) {
        const target = archiveFormatEvent.target;
        const name = target.name;
        this.setState({
            archiveType: name,
        });
    }

    handleClChange(event) {
        this.setState({ compressionLevel: event.target.value });
    }

    handleFormatChange(formatEvent) {
        const filetype = formatEvent.filetype;
        const format = formatEvent.format;
        const name = 'extract'
            .concat(filetype.charAt(0).toUpperCase()).concat(filetype.slice(1))
            .concat(format.charAt(0).toUpperCase()).concat(format.slice(1));
        this.setState({
            [name]: formatEvent.value,
        });
    }

    setQidReq() {
        const qStringValue = (this.state.activeKey === '1') ? this.state.q : this.transformIdListToQuery();
        let href = `${config.apiUrl}/q_id/${this.lastqId}`;
        fetch(href, {
            method: 'POST',
            body: JSON.stringify({
                qString: qStringValue,
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => {
            if (res.status === 200) {
                console.log('OK. q_id "' + this.lastqId + '" successfully set');
                if (this.state.querywithIDorARK !== qStringValue) this.setState({ querywithIDorARK: qStringValue });
            } else {
                console.error('q_id "' + this.lastqId + '" NOT set. API return code ' + res.status + '(' + res.message + ')');
                throw new Error(res.message);
            }
        }).catch(function (error) {
            console.log(error);
            return error === undefined;
        });
    }

    handleSubmit(event) {
        const href = this.buildURLFromState(null, true, false);
        if ((this.state.activeKey === '2') || (this.state.activeKey === '4')) {
            if (href.searchParams.get('q')) {
                href.searchParams.set('q', this.transformIdListToQuery());
            }
            href.searchParams.set('queryType', this.state.queryType);
            if (this.state.dotCorpusidCount > 0) {
                href.searchParams.set('size', Math.min(this.state.size,this.state.dotCorpusidCount) );
            }
            if (!this.warningBadDocCountAlreadyDisplayed && 
                    (this.state.dotCorpusidCount > this.nbDocsFound
                    || this.state.querywithIDorARK.split("\n").length > this.nbDocsFound) ) {
                this.warningBadDocCountAlreadyDisplayed = true;
                this.setState({
                        showWarningMissingDocs: true,
                    });
                return;
            }
            href.searchParams.delete('withID');
        }

        if (this.state.downloadBtnClass === 'text-danger') {
            if (window.confirm("La taille de l'archive est très grande : poursuivre le téléchargement ?")) {
                this.setState({
                    downloading: true,
                    URL2Download: href,
                });
            } else {
                return;
            }
        }

        this.setState({
            downloading: true,
            URL2Download: href,
        });

        if ((this.state.q.length >= characterLimit && this.state.activeKey === '1') || (this.state.querywithIDorARK.length >= characterLimit && this.state.activeKey === '2') || (this.state.querywithIDorARK.length >= characterLimit && this.state.activeKey === '4')) {
            let hrefSet = `${config.apiUrl}/q_id/${this.lastqId}`;
            fetch(hrefSet, {
                method: 'POST',
                body: JSON.stringify({
                    qString: this.state.activeKey === '1' ? this.state.q : this.transformIdListToQuery(),
                }),
                headers: { 'Content-Type': 'application/json' },
            }).then(() => {
                window.setTimeout(() => {
                    window.location = href;
                }, 10);
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            window.setTimeout(() => {
                window.location = href;
            }, 1000);
        }
        event.preventDefault();
    }
    resetState() {
        this.setState({
            q: '',
            querywithIDorARK: '',
            qId: '',
            size: config.defaultSize,
            limitNbDoc: config.limitNbDoc,
            extractMetadata: false,
            extractFulltext: false,
            extractEnrichments: false,
            extractCovers: false,
            extractAnnexes: false,
            downloading: false,
            URL2Download: '',
            errorRequestSyntax: '',
            errorDuringDownload: '',
            rankBy: 'qualityOverRelevance',
            total: 0,
            nbDocsCalculating: false,
            compressionLevel: 0,
            archiveType: 'zip',
            samples: [],
            archiveSize: '--',
            downloadBtnClass: 'text-default',
            queryType: '',
            uploadTxt: '',
        });
        this.shouldHideUpersonnalise = 'hidden';
        this.shouldHideU = 'col-lg-12 col-sm-12 usages';
        this.usage = false;
        this.loadexUsageLabel = 'Choisir cet usage';
        this.persUsageLabel = 'Choisir cet usage';
        this.selectedPersClass = '';
        this.selectedLodexClass = '';
        this.limitNbDocClass = 'limitNbDocTxtHide';
        this.showSamplesDiv = false;
        this.showEstimatedSizeTxtClass = 'hidden';
        this.showDownloadCorpusBtn = 'false';
        this.handleQChange = false;
        this.showSamplesLoader = false;
    }

    handleSelectNav(eventKey) {
        // reset Recherche classique
        if (eventKey === '1') {
            this.setState({ activeKey: eventKey });
            let textarea = document.getElementById('textarea');
            if (textarea) {
                textarea.setAttribute('style', 'height:100%');
            }
            this.textAreaRowsLength = 1;
            this.resetState();
        }

        if (eventKey === '2') {
            this.setState({ activeKey: eventKey });
            let textarea = document.getElementById('textarea');
            if (textarea) {
                textarea.setAttribute('style', 'height:100%');
            }
            this.textAreaRowsLength = 2;
            this.resetState();
        }

        if (eventKey === '3') {
            this.setState({ showModalExemple: true });
            let textarea = document.getElementById('textarea');
            if (textarea) {
                textarea.setAttribute('style', 'height:100%');
            }
        }
        if (eventKey === '4') {
            this.setState({ activeKey: eventKey });
            this.resetState();
            this.setState({ showDownloadCorpusBtn: true });
        }
    }

    handleCancel(event) {
        if (window.localStorage) {
            const { href } = this.buildURLFromState(null, true, false);
            const url = href.slice(href.indexOf('?'));
            const formats = qs.parse(url).extract.split(';');
            const dlStorage = {
                url,
                date: new Date(),
                formats,
                size: this.state.size,
                rankBy: this.state.rankBy,
                archiveType: this.state.archiveType,
                compressionLevel: this.state.compressionLevel,
            };
            this.textAreaRowsLength = 1;
            if (this.state.qId) {
                dlStorage.qId = this.state.qId;
            }
            dlStorage.q = this.state.activeKey === '1' ? this.state.q : this.state.querywithIDorARK;
            if (JSON.parse(window.localStorage.getItem('dlISTEX'))) {
                const oldStorage = JSON.parse(window.localStorage.getItem('dlISTEX'));
                oldStorage.push(dlStorage);
                if (oldStorage.length > nbHistory) {
                    oldStorage.shift();
                }
                window.localStorage.setItem('dlISTEX', JSON.stringify(oldStorage));
            } else {
                window.localStorage.setItem('dlISTEX', JSON.stringify([dlStorage]));
            }
        }

        this.erase();
        if (event !== undefined) {
            event.preventDefault();
        }
        // TODO: socket.IO
        // this.state.downloadProgress = 0;
    }

    updateUrl(defaultState = false) {
        if (!defaultState) {
            const newUrl = this.buildURLFromState(null, true, false).href.slice(this.buildURLFromState(null, true, false).href.indexOf('?'));
            window.history.pushState('', '', newUrl);
        } else {
            const url = window.location.href.split('/');
            const domain = `${url[0]}//${url[2]}`;
            window.history.pushState('', '', domain);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    formatBytes(a, b = 0) {
        if (a === 0) return '0 Octets';
        const c = b < 0 ? 0 : b,
            d = Math.floor(Math.log(a) / Math.log(1024));
        return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + ' ' + ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'][d];
    }

    // eslint-disable-next-line class-methods-use-this
    corpusParser(content, fileName) {
        this.setState({ querywithIDorARK: '' });
        let splitStr = content.split('[ISTEX]');
        if (splitStr.length != 2) {
            NotificationManager.error('Le fichier .corpus est erroné : la section [ISTEX] est introuvable ! ', '', 50000);
            return;
        }
        let arrayOfLines = splitStr[1].match(/[^\r\n]+/g);
        let ids = [];
        let NoErrorFound = true;
        arrayOfLines.forEach(function (item) {
            let id = item.split(/\s+/);
            if (id.length >= 2) {
                if (id[0] == 'id') {
                    if (id[1].length == 40) {
                        if (ids.length < 100000) {
                            ids.push(id[1]);
                        }
                    } else {
                        NotificationManager.error('Erreur dans le format d\'un Id !', 'Le fichier .corpus est erroné', 50000);
                        NoErrorFound = false;
                    }
                } else if (id[0] == 'ark') {
                    if (id[1].length == 25) {
                        if (ids.length < 100000) {
                            ids.push(id[1]);
                        }
                    } else {
                        NotificationManager.error('Erreur dans le format d\'un Ark !', 'Le fichier .corpus est erroné', 50000);
                        NoErrorFound = false;
                    }
                } else {
                    NotificationManager.error('Id ou Ark non trouvé !', 'Le fichier .corpus est erroné', 50000);
                    NoErrorFound = false;
                }
            } else {
                NotificationManager.error('Le fichier est mal formaté !', 'Le fichier .corpus est erroné', 50000);
                NoErrorFound = false;
            }
        });
        if (NoErrorFound) {
            this.setState({
                uploadTxt: 'Fichier ' + fileName + ' analysé. ' + ids.length + ' identifiants ont été parcourus. (Attention, le nombre des documents disponibles au téléchargement peut être inférieur si certains identifiants ne sont pas trouvés par le moteur de recherche)',
                dotCorpusidCount: ids.length,
            });
            NotificationManager.success('', 'Import du fichier .corpus terminé', 50000);
            this.setState({
                querywithIDorARK: ids.join('\n'),
            }, () => this.waitRequest(true));
        }
    }

    // eslint-disable-next-line class-methods-use-this
    parseCorpusToArksOrIds(target) {
        let textCorpus = target.files[0].text();
        if (textCorpus == undefined) return;
        textCorpus.then(t => this.corpusParser(t, target.files[0].name));
    }
    hashMD5(q, queryChanged) {
        let key;
        if (queryChanged || this.lastqId == undefined) {
            key = md5(q);
            this.lastqId = key;
        } else {
            key = this.lastqId;
        }
        sessionStorage.clear();
        sessionStorage.setItem(key, q);
        return key;
    }
    // buildURLFromState(query = null, withHits = true) {
    buildURLFromState(query, withHits, queryChanged) {
        const ISTEX = new URL(`${config.apiUrl}/document/`);
        const filetypeFormats = Object.keys(this.state)
            .filter(key => key.startsWith('extract'))
            .filter(key => this.state[key])

            .map(key => decamelize(key, '-'))
            .map(key => key.split('-').slice(1))
            .map(([filetype, format]) => ({ filetype, format }))
            .reduce((prev, { filetype, format }) => {
                if (!prev[filetype]) {
                    prev[filetype] = [format];
                } else {
                    prev[filetype].push(format);
                }
                return prev;
            }, {});
        const extract = Object.keys(filetypeFormats)
            .reduce((prev, filetype) => {
                const formats = filetypeFormats[filetype];
                return prev
                    .concat(filetype)
                    .concat(formats[0] || formats.length > 1 ? '[' : '')
                    .concat(!formats[0] ? formats.slice(1) : formats)
                    .concat(formats[0] || formats.length > 1 ? '];' : ';');
            }
            , '')
            .slice(0, -1);

        if (this.state.activeKey === '1') {
            if (this.state.q.length < characterLimit) {
                ISTEX.searchParams.delete('q_id');
                ISTEX.searchParams.set('q', query || this.state.q);
            } else {
                // eslint-disable-next-line no-undef
                ISTEX.searchParams.set('q_id', this.hashMD5(this.state.q.trim(), queryChanged));
            }
        } else {
            ISTEX.searchParams.set('withID', true);
            if (this.state.querywithIDorARK.length < characterLimit) {
                ISTEX.searchParams.delete('q_id');
                ISTEX.searchParams.set('q', query || this.transformIdListToQuery());
            } else {
                // eslint-disable-next-line no-undef
                ISTEX.searchParams.set('q_id', this.hashMD5(this.transformIdListToQuery(), queryChanged));
            }
        }

        ISTEX.searchParams.set('extract', extract);
        if (this.state.total < this.state.limitNbDoc) {
            this.state.limitNbDoc = this.state.total;
        }
        if (withHits) {
            if (this.state.size <= this.state.limitNbDoc) {
                ISTEX.searchParams.set('size', this.state.size);
            }

            if (this.state.size <= 0) {
                this.state.size = 0;
                ISTEX.searchParams.set('size', this.state.size);
            }

            if (this.state.size > this.state.limitNbDoc) {
                this.state.size = this.state.limitNbDoc;
                ISTEX.searchParams.set('size', this.state.size);
            }
        }
        ISTEX.searchParams.set('rankBy', this.state.rankBy);
        ISTEX.searchParams.set('archiveType', this.state.archiveType);
        ISTEX.searchParams.set('compressionLevel', this.state.compressionLevel);
        ISTEX.searchParams.set('sid', 'istex-dl');


        if (this.state.total === 0) {
            this.state.samples = [];
        }

        let sizes = {};

        if (this.state.compressionLevel == 0) {
            sizes = require('../src/formatSize.json').zipCompression.noCompression.sizes;
        } else if (this.state.compressionLevel == 6) {
            sizes = require('../src/formatSize.json').zipCompression.mediumCompression.sizes;
        } else if (this.state.compressionLevel == 9) {
            sizes = require('../src/formatSize.json').zipCompression.highCompression.sizes;
        }

        let size = this.state.size;

        let archiveSize = 0;


        if (filetypeFormats.covers !== undefined) {
            archiveSize += sizes.coversSize * size;
        }

        if (filetypeFormats.annexes !== undefined) {
            archiveSize += sizes.annexesSize * size;
        }

        if (filetypeFormats.metadata !== undefined) {
            filetypeFormats.metadata.forEach((format) => {
                if (format !== undefined) {
                    archiveSize += sizes.metadataSize[format] * size;
                }
            });
        }

        if (filetypeFormats.fulltext !== undefined) {
            filetypeFormats.fulltext.forEach((format) => {
                if (format !== undefined) {
                    archiveSize += sizes.fulltextSize[format] * size;
                }
            });
        }

        if (filetypeFormats.enrichments !== undefined) {
            filetypeFormats.enrichments.forEach((format) => {
                if (format !== undefined) {
                    archiveSize += sizes.enrichmentsSize[format] * size;
                }
            });
        }

        if (this.usage === 1) {
            ISTEX.searchParams.set('usage', this.usage);
            this.selectedLodexClass = '';
            this.persUsageLabel = 'usage sélectionné';
            this.loadexUsageLabel = 'choisir cet usage';
            this.selectedPersClass = 'selectedUsage';
        } else if (this.usage === 2) {
            ISTEX.searchParams.set('usage', this.usage);
            this.selectedLodexClass = 'selectedUsage';
            ISTEX.searchParams.set('extract', 'metadata[json]');
            this.loadexUsageLabel = 'usage sélectionné';
            this.persUsageLabel = 'choisir cet usage';
            this.selectedPersClass = '';
            archiveSize = sizes.metadataSize.json * size;
        }


        // 5GB
        if (archiveSize >= 5368709120) {
            this.showEstimatedSizeTxtClass = 'btn-td1';
            this.state.downloadBtnClass = 'text-danger';
        }

        // 1GB
        if (archiveSize >= 1073741824 && archiveSize < 5368709120) {
            this.showEstimatedSizeTxtClass = 'btn-td1';
            this.state.downloadBtnClass = 'text-warning';
        }

        // < 1GB
        if (archiveSize < 1073741824 && archiveSize > 0) {
            this.showEstimatedSizeTxtClass = 'hidden';
            this.state.downloadBtnClass = 'text-success';
        }

        this.state.archiveSize = '> ' + this.formatBytes(archiveSize);

        if (archiveSize === 0) {
            this.state.archiveSize = '--';
            this.showEstimatedSizeTxtClass = 'hidden';
            this.state.downloadBtnClass = 'text-default';
        }

        return ISTEX;
    }

    erase() {
        this.child.forEach((c) => {
            if (!c.props.disabled) {
                const name = 'extract'
                    .concat(c.props.filetype.charAt(0).toUpperCase())
                    .concat(c.props.filetype.slice(1));
                c.uncheckCurrent(name);
            }
        });
        this.loadexUsageLabel = 'Choisir cet usage';
        this.persUsageLabel = 'Choisir cet usage';
        this.selectedPersClass = '';
        this.selectedLodexClass = '';
        this.usage = false;
        this.shouldHideUpersonnalise = 'hidden';
        this.shouldHideU = 'col-lg-12 col-sm-12 usages';
        this.showSamplesDiv = false;
        let textarea = document.getElementById('textarea');
        if (textarea) {
            textarea.setAttribute('style', 'height:auto');
        }
        this.textAreaRowsLength = 1;
        this.setState(this.defaultState);
    }

    tryExempleRequest(queryExample, withID = false) {
        if (withID) {
            this.setState({
                activeKey: '2',
                querywithIDorARK: queryExample,
                showModalExemple: false,
            });
            this.textAreaRowsLength = queryExample.split('\n').length;
        } else {
            this.setState({
                activeKey: '1',
                q: queryExample,
                showModalExemple: false,
            });
        }
        this.handleQueryChange(null, queryExample);
        document.body.click();
    }

    updateUrlAndLocalStorage() {
        if (window.localStorage) {
            let isDefaultState = true;
            Object.keys(this.defaultState).forEach((attribute) => {
                if (this.defaultState[attribute] !== this.state[attribute]) {
                    if (attribute != 'limitNbDoc' && attribute != 'nbDocsCalculating' && attribute != 'samples') {
                        isDefaultState = false;
                    }
                }
            });
            if (!isDefaultState) {
                const { href } = this.buildURLFromState(null, true, false);
                const url = href.slice(href.indexOf('?'));
                this.updateUrl();
                window.localStorage.setItem('dlISTEXlastUrl', JSON.stringify(url));
            } else {
                this.updateUrl(true);
            }
        }
    }

    isDownloadDisabled() {
        const filetypeFormats = Object.keys(this.state)
            .filter(key => key.startsWith('extract'))
            .filter(key => this.state[key]);
        if (this.usage === 2 && this.state.total > 0 && this.state.size > 0) {
            return false;
        }
        return (!this.state.total || this.state.total <= 0 || filetypeFormats.length <= 0 || this.state.size <= 0);
    }

    showUsagePersonnalise() {
        this.shouldHideUpersonnalise = '';
        this.shouldHideU = 'hidden';
        this.selectedLodexClass = '';
        this.usage = 1;
        this.persUsageLabel = 'usage sélectionné';
        this.loadexUsageLabel = 'choisir cet usage';
        this.selectedPersClass = 'selectedUsage';

        this.setState({});
    }

    showUsages() {
        this.shouldHideUpersonnalise = 'hidden';
        this.shouldHideU = 'col-lg-12 col-sm-12 usages';
        this.setState({});
    }

    showUsageLodex() {
        this.usage = 2;
        this.selectedLodexClass = 'selectedUsage';
        this.loadexUsageLabel = 'usage sélectionné';
        this.persUsageLabel = 'choisir cet usage';
        this.selectedPersClass = '';
        this.setState({});
    }

    checkSamples = () => {
        let samplesRes = this.state.samples;

        if (samplesRes.length > 0) {
            this.showSamplesDiv = true;
            this.showSamplesLoader = false;
        } else {
            if (this.state.total > 0) {
                this.showSamplesLoader = true;
            }
            this.showSamplesDiv = false;
        }
    }

    showSamples = () => {
        let samples = [];

        let samplesRes = this.state.samples;

        // Outer loop to create parent
        if (samplesRes.length === 0 || samplesRes === undefined) {
            return '';
        }
        function truncate(source, size) {
            return source.length > size ? source.slice(0, size - 1) + '…' : source;
        }

        for (let i = 0; i < samplesRes.length; i++) {
            let authorStr = '';
            let authors = samplesRes[i].author;
            if (authors !== undefined) {
                for (let j = 0; j < authors.length; j++) {
                    authorStr += authors[j].name;
                    authorStr += ' ; ';
                }
            }
            let authorsStr = truncate(authorStr, 42);

            let titleStr = truncate(samplesRes[i].title, 75);

            let hostTitleStr = truncate(samplesRes[i].host.title, 40);

            // Create the parent and add the children
            samples.push(
                <table className="col-lg-4 col-md-4 col-sm-6 col-xs-12 noPaddingLeftRight res_widget" onClick={() => { window.open(config.apiUrl + '/' + samplesRes[i].arkIstex + '/fulltext.pdf', samplesRes[i].title); }}>
                    <tbody>
                        <tr>
                            <td colSpan="2" title={samplesRes[i].title} className="res_title">{titleStr}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" title={authorStr} className="res_author">{authorsStr}</td>
                        </tr>
                        <tr className="res_tr_bottom" style={{ width: '100%' }}>
                            <td className="" title={samplesRes[i].host.title} style={{ width: '70%', display: 'inline-block', paddingLeft: '5px' }}>{hostTitleStr}</td><td style={{ width: '30%', display: 'inline-block', textAlign: 'right' }} className="res_pubDate">{samplesRes[i].publicationDate}</td>
                        </tr>
                    </tbody>
                </table>,
            );
        }
        return samples;
    }

    // eslint-disable-next-line class-methods-use-this
    hover() {
        document.getElementById('imgUpload').src = '/img/ico_upload_active.png';
    }

    // eslint-disable-next-line class-methods-use-this
    unhover() {
        document.getElementById('imgUpload').src = '/img/ico_upload.png';
    }
    render() {
        // TODO: socket.IO
        // const progressInstance = <ProgressBar bsStyle="success" active now={this.state.downloadProgress} label={`${this.state.downloadProgress}%`} />;
        const closingButton = (
            <Button
                bsClass="buttonClose"
                onClick={() => { document.body.click(); }}
            >
                &#x2716;
            </Button>);

        const popoverRequestHelp = (
            <Popover
                id="popover-request-help"
                title={<span> Requête {closingButton}</span>}
            >
                Pour interroger ISTEX, vous avez le choix entre différents modes : un mode de recherche classique par équation booléenne, un mode de requêtage utilisant 
            une liste d’identifiants pérennes de type ARK ou bien encore l’import d’un fichier spécifiant un corpus de documents au moyen d’identifiants uniques. 
            <br />
            Si vous avez besoin d'aide, consultez la <a href="https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-" target="_blank" rel="noopener noreferrer">documentation ISTEX</a> ou bien contactez <a href="mailto:contact@listes.istex.fr">l’équipe ISTEX</a>.
                <br />
            </Popover>
        );

        const popoverSampleList = (
            <Popover
                id="popover-sample-list"
                title={<span> Échantillon de résultats {closingButton}</span>}
            >
                Cet échantillon peut vous aider à ajuster votre équation à votre besoin en vous offrant l’accès au texte intégral de chacun des documents proposés. Par défaut 
            sont affichées les 6 premières réponses, classées par pertinence & qualité des résultats par rapport à votre requête. Le choix d’un autre mode de tri modifiera 
            l’échantillon en conséquence.
                <br />
            </Popover>
        );

        const popoverRequestClassic = (
            <Popover
                id="popover-request-classic"
                title={<span> Équation booléenne {closingButton}</span>}
            >
                Pour construire votre équation booléenne, vous pouvez vous aider de l'échantillon de requêtes pédagogiques accessibles via le bouton "Exemples",
            de la <a href="https://doc.istex.fr/tdm/requetage/" target="_blank" rel="noopener noreferrer">documentation ISTEX</a> ou bien du mode de recherche avancée 
            du <a href="http://demo.istex.fr/" target="_blank" rel="noopener noreferrer">démonstrateur ISTEX</a>.
            </Popover>
        );
        
        const popoverRequestARK = (
            <Popover
                id="popover-request-ark"
                title={<span> Identifiants ARK {closingButton}</span>}
            >
            Copiez/collez dans cet onglet une liste d'identifiants de type ARK et le formulaire l'interprétera automatiquement.
            Explorez ce mode de recherche en cliquant sur l’exemple disponible via le bouton "Exemples".  <br />
            Pour en savoir plus sur les identifiants ARK, reportez vous à la <a href="https://doc.istex.fr/api/ark/" target="_blank" rel="noopener noreferrer">documentation ISTEX</a>. 
            </Popover>
        );
        
        const popoverRequestDotCorpus = (
            <Popover
                id="popover-request-dotcorpus"
                title={<span> Import de fichier {closingButton}</span>}
            >
                  Cliquez sur l’icône ci-dessous et sélectionnez un fichier de type “.corpus” précisant les identifiants uniques (tels que des identifiants ARK) des documents 
            qui composent votre corpus. <br />
                Pour disposer d’un fichier .corpus, consultez la <a href="https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-" target="_blank" rel="noopener noreferrer">documentation ISTEX</a>.


            </Popover>
        );

        const examplesTooltip = (
            <Tooltip data-html="true" id="resetTooltip">
                Testez des exemples de requête
            </Tooltip>
        );

        const resetTooltip = (
            <Tooltip data-html="true" id="resetTooltip">
                Effacez tout pour redémarrer avec un formulaire vide
            </Tooltip>
        );

        const reloadTooltip = (
            <Tooltip data-html="true" id="previewTooltip">
                Récupérez l&apos;état en cours de votre formulaire
            </Tooltip>
        );

        const shareTooltip = (
            <Tooltip data-html="true" id="resetTooltip">
                Activez cette fonctionnalité en complétant le formulaire et partagez votre corpus avant de le télécharger
            </Tooltip>
        );

        const historyTooltip = (
            <Tooltip data-html="true" id="previewTooltip">
                Accédez à l&apos;historique de vos 30 derniers téléchargements
            </Tooltip>
        );

        const tryRequestTooltip = (
            <Tooltip data-html="true" id="tryRequestTooltip">
                Essayez cette requête
            </Tooltip>
        );

        // const previewTooltip = (
        //    <Tooltip data-html="true" id="previewTooltip">
        //    Cliquez pour pré-visualiser les documents correspondant à votre requête
        //     </Tooltip>
        // );
        const popoverUsagePerso = (
            <Popover
                id="popover-filetype-help"
                title={<span> Usage personnalisé{closingButton}</span>}
            >
                Les différents formats et types de fichiers disponibles sont décrits succinctement dans cette interface et plus complètement dans 
            la <a href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html" target="_blank" rel="noopener noreferrer">documentation ISTEX</a>. <br />
            Attention : toutes les publications ISTEX ne possèdent pas l’ensemble des types de fichiers et de formats possibles (notamment annexes, 
            couvertures ou enrichissements).
            </Popover>
        );

        const popoverFiletypeHelp = (
            <Popover
                id="popover-filetype-help"
                title={<span> Usage {closingButton}</span>}
            >
                Le choix du mode "Usage personnalisé" donne accès à tous les types de fichiers et de formats existants dans ISTEX.
                En revanche, le choix d’une plateforme ou d’un outil particuliers induit une sélection automatique des formats et types de fichiers qui seront extraits. <br />
                Voir la <a href="https://doc.istex.fr/tdm/extraction/istex-dl.html#usage_1" target="_blank" rel="noopener noreferrer">documentation ISTEX</a>.
            </Popover>
        );

        const popoverDownloadHelp = (
            <Popover
                id="popover-download-help"
                title={<span> Téléchargement {closingButton}</span>}
            >
                Une estimation de la taille du corpus s’affiche dans le bouton "télécharger" lorsqu’elle excède 1 Go. <br />
                Dans le cas d’un corpus volumineux, sélectionnez le niveau de compression approprié à votre bande passante et à l’espace de stockage disponible 
                sur votre disque dur.<br />
                En cas de difficultés lors de l’ouverture de l’archive zip avec les outils Windows natifs, utilisez par exemple le logiciel 
                libre <a href="http://www.7-zip.org/" target="_blank" rel="noopener noreferrer">7-zip</a>. <br />
                Voir la <a href="https://doc.istex.fr/tdm/extraction/istex-dl.html#t%C3%A9l%C3%A9chargement" target="_blank" rel="noopener noreferrer">documentation ISTEX</a>.
                               
            </Popover>
        );

        const disabledDownloadTooltip = (
            <Tooltip data-html="true" id="disabledDownloadTooltip">
                <p>
                    Pour activer le téléchargement, complétez le formulaire en remplissant la fenêtre de requêtage par
                    au moins 1&nbsp;caractère, en sélectionnant au moins 1&nbsp;document et en cochant au moins 1&nbsp;format
                    de fichier
                </p>
            </Tooltip>
        );
        /*
        const popoverCharacterLimitHelp = (
            <Popover
                id="popover-character-limit-help"
                title={<span> Longueur des requêtes {closingButton}</span>}
            >
                <p>
                    Votre requête ne peut pas dépasser un certain nombre de caractères. Ce nombre correspond
                    à la limite, déterminée empiriquement, actuellement rencontrée
                    sur les navigateurs Firefox et Chrome. Pour le navigateur Edge, il est de 1&nbsp;600 caractères.
                    <br />
                    À la valeur du nombre de caractères restants, s’ajoute une indication colorée pour vous alerter 
                    sur la proximité ou le dépassement de cette limite. 
                </p>
            </Popover>
        );
        */

        const popoverRequestLimitWarning = (
            <Popover
                id="popover-request-limit-warning"
                html="true"
                title={<span>Attention{closingButton}</span>}
                trigger="click"
            >
                Reformulez votre requête ou vous ne pourrez télécharger que les&nbsp;
                {commaNumber.bindWith('\xa0', '')(this.state.limitNbDoc)} premiers
                documents sur les&nbsp;
                {commaNumber.bindWith('\xa0', '')(this.state.total)} de résultats potentiels.
            </Popover>
        );

        const popoverRequestLimitHelp = (
            <Popover
                id="popover-request-limit-help"
                title={<span> Nombre de documents {closingButton}</span>}
            >
                Actuellement, il n’est pas possible de télécharger plus de 100 000 documents.
                Cette valeur a été fixée arbitrairement, pour limiter le volume et la durée du téléchargement à des dimensions raisonnables.<br />
                Si le nombre de documents à extraire est inférieur au nombre total des résultats correspondant à votre requête, le choix d’un mode de tri des documents 
            peut vous intéresser (voir rubrique suivante).

            </Popover>
        );

        const popoverChoiceHelp = (
            <Popover
                id="popover-choice-help"
                title={<span> Mode de classement {closingButton}</span>}
            >
                Dans le cas où vous ne téléchargez qu’un sous-ensemble de documents par rapport aux résultats de votre requête,
                les documents sélectionnés pour votre corpus seront extraits en fonction, soit d’un ordre de pertinence relevé par un score de qualité (choix 
                privilégié par défaut), soit d’un ordre de pertinence seul, soit tirés de manière aléatoire,
                ce mode de tri étant plus représentatif de la diversité des résultats.<br />Voir 
                la <a href="https://doc.istex.fr/api/results/scoring.html" target="_blank" rel="noopener noreferrer">documentation ISTEX</a>.
            </Popover>

        );

        const fulltextTooltip = (
            <Tooltip data-html="true" id="fulltextTooltip">
                Texte intégral
            </Tooltip>
        );

        const metadataTooltip = (
            <Tooltip data-html="true" id="metadataTooltip">
                Métadonnées
            </Tooltip>
        );

        const coversTooltip = (
            <Tooltip data-html="true" id="coversTooltip">
                Documents textuels, images, etc.
            </Tooltip>
        );

        const appendicesTooltip = (
            <Tooltip data-html="true" id="appendicesTooltip">
                Documents textuels, images, vidéos, etc.
            </Tooltip>
        );

        const enrichmentsDisabledTooltip = (
            <Tooltip data-html="true" id="enrichmentsDisabledTooltip">
                Les différents enrichissements proposés dans ISTEX seront prochainement téléchargeables
            </Tooltip>
        );

        const emptyTooltip = (
            <Tooltip id="empty-tooltip" style={{ display: 'none' }} />
        );

        this.updateUrlAndLocalStorage();


        const urlToShare = `${config.dlIstexUrl}/${document.location.href.slice(document.location.href.indexOf('?'))}`;
        const style = {
            maxHeight: '600px',
        };
        return (
            <div className={`container ${this.props.className}`}>
                <NotificationContainer />
                <form onSubmit={this.handleSubmit}>

                    <div className="istex-dl-request row">
                        <div className="col-lg-12 col-sm-12">
                            <h2 className="exempleH2">
                                <span className="num-etape">&nbsp;1.&nbsp;</span>
                                Requête
                                &nbsp;

                                <OverlayTrigger
                                    trigger="click"
                                    rootClose
                                    placement="left"
                                    overlay={popoverRequestHelp}
                                >
                                    <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                </OverlayTrigger>
                                &nbsp;
                            </h2>

                            <p>
                                Explicitez le corpus souhaité en fonction de votre sélection parmi l’un des onglets ci-dessous :
                            </p>
                            <div className="form-group">
                                <FormGroup
                                    controlId="formBasicText"
                                    validationState={this.characterNumberValidation()}
                                >
                                    <Nav

                                        bsStyle="pills"
                                        activeKey={this.state.activeKey}
                                        onSelect={k => this.handleSelectNav(k)}
                                    >
                                        <NavItem eventKey="1">
                                            Équation booléenne
                                            &nbsp;
                                            <OverlayTrigger
                                                trigger="click"
                                                rootClose
                                                placement="top"
                                                overlay={popoverRequestClassic}
                                            >
                                                <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                            </OverlayTrigger>
                                        </NavItem>
                                        <NavItem eventKey="2">
                                            Identifiants ARK
                                            &nbsp;
                                            <OverlayTrigger
                                                trigger="click"
                                                rootClose
                                                placement="top"
                                                overlay={popoverRequestARK}
                                            >
                                                <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                            </OverlayTrigger>
                                        </NavItem>
                                        <NavItem eventKey="4">
                                            Import de fichier
                                            &nbsp;
                                            <OverlayTrigger
                                                trigger="click"
                                                rootClose
                                                placement="top"
                                                overlay={popoverRequestDotCorpus}
                                            >
                                                <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                            </OverlayTrigger>
                                        </NavItem>
                                        <NavItem eventKey="3" className="floatRight">
                                            Exemples
                                            &nbsp;
                                            <OverlayTrigger
                                                rootClose
                                                placement="top"
                                                overlay={examplesTooltip}
                                            >
                                                <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                            </OverlayTrigger>
                                        </NavItem>
                                    </Nav>
                                    {(this.state.activeKey != 4) &&
                                        <textarea
                                            className="form-control"
                                            ref={c => (this.textarea = c)}
                                            placeholder={this.state.activeKey === '1'
                                                ? 'brain AND language:fre'
                                                : 'ark:/67375/0T8-JMF4G14B-2\nark:/67375/0T8-RNCBH0VZ-8'
                                            }
                                            style={style}
                                            name="q"
                                            id="textarea"
                                            rows={this.textAreaRowsLength}
                                            autoFocus="true"
                                            value={this.state.activeKey === '1'
                                                ? this.state.q
                                                : this.state.querywithIDorARK
                                            }
                                            onChange={this.handleQueryChange}
                                        />
                                    }
                                    {(this.state.activeKey == 4 && !this.state.uploadTxt) &&
                                        // eslint-disable-next-line jsx-a11y/label-has-for
                                        <div className="col-sm-12 col-lg-12 col-md-12 col-xs-12 alignTxt "><label onMouseOver={() => this.hover()} onMouseOut={() => this.unhover()} className="custom-file-upload"><input id="uploaderBtn" className="input-upload" accept=".corpus" type="file" onChange={e => this.parseCorpusToArksOrIds(e.target)} />  <img id="imgUpload" className="uploadIcon" src="/img/ico_upload.png" alt="" /><br /> Sélectionnez votre fichier</label></div>
                                    }
                                    {(this.state.activeKey == 4 && this.state.uploadTxt) &&
                                        // eslint-disable-next-line jsx-a11y/label-has-for
                                        <div className="col-sm-12 col-lg-12 col-md-12 col-xs-12 alignTxt "><label onMouseOver={() => this.hover()} onMouseOut={() => this.unhover()} className="custom-file-upload-upd"><input id="uploaderBtn" className="input-upload" accept=".corpus" type="file" onChange={e => this.parseCorpusToArksOrIds(e.target)} />  <img id="imgUpload" className="uploadIcon" src="/img/ico_upload.png" alt="" /><br /> Modifiez en sélectionnant un autre fichier</label></div>
                                    }
                                    {(this.state.activeKey == 4 && this.state.uploadTxt) &&
                                        // eslint-disable-next-line jsx-a11y/label-has-for
                                        <div className="col-sm-12 col-lg-12 col-md-12 col-xs-12 centerTxt"><label>{this.state.uploadTxt}</label></div>
                                    }

                                </FormGroup>
                            </div>
                            {this.state.nbDocsCalculating &&
                                <p className="pTxt">
                                    Calcul en cours du nombre de résultats...
                                    &nbsp;
                                    <img src="/img/loader_2.gif" alt="" width="40px" height="40px" />
                                </p>
                            }
                            {this.state.total > 0 && (this.state.q !== '' || this.state.querywithIDorARK !== '') &&
                                <p className="pTxt">
                                    L’équation saisie correspond à
                                    &nbsp;
                                    <OverlayTrigger>
                                        <span>
                                            {this.state.total ?
                                                commaNumber.bindWith('\xa0', '')(this.state.total)
                                                    .concat(' document(s)')
                                                : ''}
                                        </span>

                                    </OverlayTrigger>
                                &nbsp;
                                    {this.state.total > this.state.limitNbDoc &&
                                        <OverlayTrigger
                                            trigger="click"
                                            rootClose
                                            placement="right"
                                            overlay={popoverRequestLimitWarning}
                                        >
                                            <i
                                                role="button"
                                                className="fa fa-exclamation-triangle"
                                                aria-hidden="true"
                                                style={{ color: 'red', marginLeft: '8px' }}
                                            />
                                        </OverlayTrigger>
                                    }
                                </p>
                            }
                            {!this.state.nbDocsCalculating && this.state.total === 0 && (this.state.q !== '' || this.state.querywithIDorARK !== '') &&
                                <p className="pTxt">
                                    L’équation saisie correspond à 0 document
                                </p>
                            }

                            <div className="form-group col-xs-12 noPaddingLeftRight">
                                Choisir le nombre de documents
                                &nbsp;
                                <OverlayTrigger
                                    trigger="click"
                                    rootClose
                                    placement="right"
                                    overlay={popoverRequestLimitHelp}
                                >
                                    <i
                                        id="requestLimitInfo"
                                        role="button"
                                        className="fa fa-info-circle"
                                        aria-hidden="true"
                                    />
                                </OverlayTrigger>
                                &nbsp;
                                :
                                &nbsp;&nbsp;
                                <div style={{ width: '100px', display: 'inline-block' }}>
                                    <NumericInput
                                        disabled={this.state.nbDocsCalculating}
                                        className="form-control"
                                        min={0} max={this.state.limitNbDoc} value={this.state.size}
                                        onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        onChange={(size) => { this.setState({ size }); }
                                        }
                                    />
                                </div>
                                &nbsp;&nbsp; <span className={this.limitNbDocClass}>/ {this.state.limitNbDoc}</span>&nbsp;&nbsp;
                                <a id="selectAllLink" role="button"
                                    onClick={() => this.selectAllDocs()} style={{ marginTop: 0 }}
                                    className={'btn btn-selectAll ' + this.selectAllActiveClass()}
                                >Tout</a>

                            </div>
                            <div className="rankBy">
                                Choisir les documents classés
                                &nbsp;
                                <OverlayTrigger
                                    trigger="click"
                                    rootClose
                                    placement="right"
                                    overlay={popoverChoiceHelp}
                                >
                                    <i
                                        id="choiceHelpInfo"
                                        role="button"
                                        className="fa fa-info-circle"
                                        aria-hidden="true"
                                    />
                                </OverlayTrigger>
                                &nbsp;
                                :
                            </div>
                            <div className="radioGroupRankBy">
                                <Radio
                                    id="radioQualityOverRelevance"
                                    inline
                                    name="qualityOverRelevance"
                                    checked={this.state.rankBy === 'qualityOverRelevance'}
                                    onChange={this.handlerankByChange}
                                >
                                    Par pertinence & qualité
                                </Radio>
                                <Radio
                                    id="radioRelevance"
                                    inline
                                    name="relevance"
                                    checked={this.state.rankBy === 'relevance'}
                                    onChange={this.handlerankByChange}
                                >
                                    Par pertinence
                                </Radio>
                                <Radio
                                    id="radioRandom"
                                    inline
                                    name="random"
                                    checked={this.state.rankBy === 'random'}
                                    onChange={this.handlerankByChange}
                                >
                                    Aléatoirement
                                </Radio>
                            </div>

                        </div>
                        <div className="col-lg-12 col-sm-12">
                            {this.checkSamples()}
                            {this.showSamplesLoader &&
                                <p className="pTxt">
                                    Recherche de l'échantillon de résultats...
                                    &nbsp;
                                    <img src="/img/loader_2.gif" alt="" width="40px" height="40px" />
                                </p>
                            }
                            {this.showSamplesDiv &&
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPaddingLeftRight samplesDiv"> Échantillon de résultats
                                    <OverlayTrigger
                                        trigger="click"
                                        rootClose
                                        placement="top"
                                        overlay={popoverSampleList}
                                    >
                                        <i role="button" className="iEchantillonRes fa fa-info-circle" aria-hidden="true" />
                                    </OverlayTrigger>
                                </div>
                            }
                            {this.showSamples()}


                        </div>
                    </div>

                    {this.state.errorRequestSyntax &&
                        <div className="istex-dl-error-request row">
                            <div className="col-lg-12 col-sm-12">
                                <p>
                                    Erreur de syntaxe dans votre requête &nbsp;
                                    <OverlayTrigger
                                        trigger="click"
                                        rootClose
                                        placement="top"
                                        overlay={popoverRequestHelp}
                                    >
                                        <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                    </OverlayTrigger>
                                    <br />
                                </p>
                                <blockquote
                                    className="blockquote-Syntax-error"
                                >
                                    {this.state.errorRequestSyntax}
                                </blockquote>
                            </div>
                        </div>
                    }

                    <div className="istex-dl-format row" >
                        <div className="col-lg-12 col-sm-12">
                            <Modal
                                dialogClassName="history-modal" show={this.state.showHistory} onHide={() => {
                                    this.setState({
                                        showHistory: false,
                                    });
                                }}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Historique des requêtes</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <StorageHistory
                                        columnNames="#,Date,Requête,Formats,Nb. docs,Tri,Actions"
                                    />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                showHistory: false,
                                            });
                                        }}
                                    >
                                        Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <br />
                            <h2>
                                <span className="num-etape">&nbsp;2.&nbsp;</span>
                                Usage
                                &nbsp;
                                <OverlayTrigger
                                    trigger="click"
                                    rootClose
                                    placement="top"
                                    overlay={popoverFiletypeHelp}
                                >
                                    <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                </OverlayTrigger>
                            </h2>
                            <p>Cliquez sur l’usage visé pour votre corpus :
                           </p>
                            <div className={this.shouldHideU}>

                                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 col-widget">
                                    <table className={'widget ' + this.selectedPersClass} onClick={() => this.showUsagePersonnalise()}>
                                        <tbody>
                                            <tr>
                                                <td className="lv1"><span className="lv11">DOC</span></td>
                                            </tr>
                                            <tr>
                                                <td className="lv2"><span className="lv21">TDM</span></td>
                                            </tr>
                                            <tr>
                                                <td className="lv3">Usage personnalisé<br /><span className="txtU">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td className="lv5" ><i className="fa fa-check ico-usage" /> {this.persUsageLabel}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 col-widget">
                                    <table className={'widget ' + this.selectedLodexClass} onClick={() => this.showUsageLodex()}>
                                        <tbody>
                                            <tr>
                                                <td className="lv1"><span className="lv11">TDM</span></td>
                                            </tr>
                                            <tr>
                                                <td className="lv2b">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td className="lv3">Lodex<br /><span className="txtU">Analyse graphique  / Exploration de corpus</span></td>
                                            </tr>
                                            <tr>
                                                <td className="lv5"><i className="fa fa-check ico-usage" />  {this.loadexUsageLabel}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={this.shouldHideUpersonnalise}>
                                <div className="up up-btn col-lg-12 col-sm-12">
                                    <span className="back-btn" onClick={() => this.showUsages()} ><i className="fa fa-chevron-left ico-back" /> Usage personnalisé</span>
                                    &nbsp;&nbsp;<OverlayTrigger
                                        trigger="click"
                                        rootClose
                                        placement="top"
                                        overlay={popoverUsagePerso}
                                    >
                                        <i role="button" className="UsagePerso fa fa-info-circle" aria-hidden="true" />
                                    </OverlayTrigger>

                                </div>
                                <div className="col-lg-12 col-sm-12">
                                    <span className="fulltextGroup">
                                        <Filetype
                                            ref={(instance) => { this.child[1] = instance; }}
                                            label="Texte intégral"
                                            filetype="fulltext"
                                            formats="pdf,tei,txt,zip,tiff"
                                            labels="PDF|TEI|TXT|ZIP|TIFF"
                                            value={this.state.extractFulltext}
                                            checkedFormats={this.state.Fulltext}
                                            onChange={this.handleFiletypeChange}
                                            onFormatChange={this.handleFormatChange}
                                            withPopover
                                            tooltip={fulltextTooltip}
                                        />
                                    </span>
                                    <span className="otherfileGroup">
                                        <Filetype
                                            ref={(instance) => { this.child[0] = instance; }}
                                            label="Métadonnées"
                                            filetype="metadata"
                                            formats="json,xml,mods"
                                            labels="JSON|XML|MODS"
                                            value={this.state.extractMetadata}
                                            checkedFormats={this.state.Metadata}
                                            onChange={this.handleFiletypeChange}
                                            onFormatChange={this.handleFormatChange}
                                            withPopover
                                            tooltip={metadataTooltip}
                                        />
                                        <Filetype
                                            ref={(instance) => { this.child[2] = instance; }}
                                            label="Annexes"
                                            filetype="annexes"
                                            formats=""
                                            labels=""
                                            value={this.state.extractAnnexes}
                                            onChange={this.handleFiletypeChange}
                                            onFormatChange={this.handleFormatChange}
                                            tooltip={appendicesTooltip}
                                        />
                                        <Filetype
                                            ref={(instance) => { this.child[3] = instance; }}
                                            label="Couvertures"
                                            filetype="covers"
                                            formats=""
                                            labels=""
                                            value={this.state.extractCovers}
                                            onChange={this.handleFiletypeChange}
                                            onFormatChange={this.handleFormatChange}
                                            tooltip={coversTooltip}
                                        />
                                    </span>
                                    <span className="enrichmentsGroup">
                                        <Filetype
                                            ref={(instance) => { this.child[4] = instance; }}
                                            label="Enrichissements"
                                            filetype="enrichments"
                                            formats="multicat,nb,refbibs,teeft,unitex"
                                            labels="multicat|nb|refBibs|teeft|unitex"
                                            value={this.state.extractEnrichments}
                                            checkedFormats={this.state.Enrichments}
                                            onChange={this.handleFiletypeChange}
                                            onFormatChange={this.handleFormatChange}
                                            withPopover
                                            tooltip={enrichmentsDisabledTooltip}
                                        />
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="istex-dl-download row">
                        <div className="col-lg-12 col-sm-12 text-center">
                            <h2>
                                <span className="num-etape">&nbsp;3.&nbsp;</span>
                                Téléchargement
                                <OverlayTrigger
                                    trigger="click"
                                    rootClose
                                    placement="top"
                                    overlay={popoverDownloadHelp}
                                >
                                    <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                </OverlayTrigger>
                            </h2>
                            <div className="col-lg-12 col-sm-12">

                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    Niveau de compression  &nbsp;
                                    :
                                    &nbsp;&nbsp;
                                    <div style={{ display: 'inline-block' }}>
                                        <select className="form-control" value={this.state.compressionLevel} onChange={this.handleClChange} >
                                            <option value="0">Sans compression</option>
                                            <option value="6">Compression moyenne</option>
                                            <option value="9">Compression élevée</option>
                                        </select>
                                    </div>
                                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                                Format de l'archive &nbsp;
                                :
                                &nbsp;&nbsp;
                                    <Radio
                                        id="radioZip"
                                        inline
                                        name="zip"
                                        checked={this.state.archiveType === 'zip'}
                                        onChange={this.handleArchiveTypeChange}
                                    >
                                        ZIP
                                    </Radio>
                                    &nbsp;&nbsp;&nbsp;
                                    <Radio
                                        id="radioTar"
                                        inline
                                        name="tar"
                                        checked={this.state.archiveType === 'tar'}
                                        onChange={this.handleArchiveTypeChange}
                                    >
                                        TAR.GZ
                                    </Radio>

                                </div>
                            </div>

                            <OverlayTrigger
                                placement="top"
                                overlay={this.isDownloadDisabled() ? disabledDownloadTooltip : emptyTooltip}
                            >
                                <table type="submit"
                                    className="btn btn-theme btn-lg"
                                    disabled={this.isDownloadDisabled()}
                                    onClick={!this.isDownloadDisabled() ? this.handleSubmit : undefined}
                                >
                                    <tr>
                                        <th className="btn-th1">Télécharger</th>
                                        <th className="btn-th2" rowSpan="2"><img className="btn-img" src="../telecharger-bleu.png" alt="" /></th>
                                    </tr>
                                    <tr>
                                        <td className={this.showEstimatedSizeTxtClass}>Taille estimée  <span className={this.state.downloadBtnClass}>{this.state.archiveSize}</span></td>
                                    </tr>
                                </table>
                            </OverlayTrigger>
                        </div>

                    </div>

                    <div className="istex-dl-menu">
                        <div className="col-lg-12 col-xs-12 col-sm-12">
                            <div className="col-lg-4 col-xs-0 col-sm-2" />
                            <OverlayTrigger
                                placement="top"
                                overlay={resetTooltip}
                                onClick={() => this.erase()}
                            >
                                <div className="col-lg-1 col-sm-2 col-xs-3 bottom-menu-ico"><i className="fa fa-eraser" aria-hidden="true" /><br /><span className="bottom-menu-txt">Réinitialiser</span></div>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={reloadTooltip}
                                onClick={Form.handleReload}
                            >
                                <div className="col-lg-1 col-sm-2 col-xs-3 bottom-menu-ico"><i className="fa fa-repeat" aria-hidden="true" /><br /><span className="bottom-menu-txt">Récupérer</span></div>
                            </OverlayTrigger>
                            <OverlayTrigger
                                rootClose
                                placement="top"
                                overlay={shareTooltip}
                                onClick={() => {
                                    if (!this.isDownloadDisabled()) {
                                        this.setState({ showModalShare: true });
                                    }
                                    this.setQidReq();
                                }}
                            >
                                <div className="col-lg-1 col-sm-2 col-xs-3 bottom-menu-ico" disabled={this.isDownloadDisabled()}><i className="fa fa-link" aria-hidden="true" /><br /><span className="bottom-menu-txt">Partager</span></div>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={historyTooltip}
                                onClick={() => {
                                    this.setState({
                                        showHistory: true,
                                    });
                                }}
                            >
                                <div className="col-lg-1 col-sm-2 col-xs-3 bottom-menu-ico"><i className="fa fa-history" aria-hidden="true" /><br /><span className="bottom-menu-txt">Historique</span></div>
                            </OverlayTrigger>

                        </div>
                    </div>
                    {this.state.errorDuringDownload &&
                        <div className="istex-dl-error-download row">
                            <div className="col-lg-12 col-sm-12">
                                <p>
                                    <i
                                        role="button"
                                        className="fa fa-exclamation-triangle"
                                        aria-hidden="true"
                                    />
                                    &nbsp;
                                    Votre téléchargement s’est interrompu :
                                    <blockquote>
                                        « …message technique de l’API… »
                                    </blockquote>
                                    Veuillez réessayer plus tard ou
                                    <a href="mailto:contact@listes.istex.fr">contactez l’équipe ISTEX</a>
                                </p>
                            </div>
                        </div>
                    }

                </form>

                <Modal
                    dialogClassName="warning-modal" 
                    show={this.state.showWarningMissingDocs} 
                    onHide={this.handleCancel}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Attention, problème potentiel détecté</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Nous avons constaté que le nombre de documents de votre liste d'identifiants était supérieur au nombre de documents réellement trouvés par l'API ISTEX. De ce fait, le nombre de documents de l'archive téléchargée peut-être inférieur au nombre de documents que vous avez demandé.</p>
                        <p>Êtes-vous sûr de vouloir continuer ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => this.handleSubmit()}
                        >
                            Télécharger quand-même
                        </Button>
                        <Button
                         onClick={() => {this.warningBadDocCountAlreadyDisplayed = false;this.setState({'showWarningMissingDocs':false});}}
                         >
                            Annuler
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.downloading} onHide={this.handleCancel} className="downloadModal">
                    <Modal.Header closeButton>
                        <Modal.Title>Téléchargement en cours</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            La génération de votre corpus est en cours.<br />
                            Veuillez patienter. L’archive sera bientôt téléchargée...
                            <br />
                            <img src="/img/loader.gif" alt="" />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleCancel}>Fermer</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showModalShare} onHide={this.hideModalShare}>
                    <Modal.Header closeButton>
                        <Modal.Title>Partager</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <FormGroup>
                            <InputGroup>
                                <FormControl bsSize="small" type="text" readOnly value={urlToShare} />
                                <InputGroup.Button>
                                    <CopyToClipboard
                                        text={urlToShare}
                                        onCopy={Form.handleCopy}
                                    >
                                        <Button
                                            id="copyButton"
                                            onClick={this.hideModalShare}
                                        >
                                            Copier
                                        </Button>
                                    </CopyToClipboard>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            onClick={this.hideModalShare}
                        >
                            Annuler
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showModalExemple} onHide={this.hideModalExemple} backdrop >
                    <Modal.Header closeButton>
                        <Modal.Title>Exemples de requêtes</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Voici quelques exemples dont vous pouvez vous inspirer pour votre recherche.
                        Cliquez sur l&apos;une des loupes et la zone de requête sera remplie automatiquement
                        par le contenu de l&apos;exemple choisi. Cet échantillon illustre différentes façons
                        d&apos;interroger l&apos;API ISTEX en utilisant :
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.orthophonie)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des troncatures sur des termes de recherche en français et en anglais
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.systematiqueVegetale)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des opérateurs booléens imbriqués
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.geophysique)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des données bibliographiques
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.intelligenceArtificielle)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des indicateurs de qualité
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.arctique)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des expressions régulières sur des termes de recherche
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.paleoclimatologie)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                             de la recherche floue et des opérateurs de proximité
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.astrophysique)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des enrichissements de type catégorie scientifique
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.beethoven)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des enrichissements de type entité nommée
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.coronavirus)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des enrichissements de type terme d’indexation
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.vieillissement, true)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des identifiants ISTEX de type ARK
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            onClick={this.hideModalExemple}
                        >
                            Annuler
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

Form.defaultProps = {
    className: '',
};
Form.propTypes = {
    className: PropTypes.string,
};
