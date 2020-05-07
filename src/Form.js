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
import Textarea from 'react-textarea-autosize';
import { Modal, Button, OverlayTrigger, Popover,
    Tooltip, FormGroup, FormControl,
    Radio, InputGroup, Nav, NavItem } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import decamelize from 'decamelize';
import qs from 'qs';
import commaNumber from 'comma-number';
import md5 from 'md5';
import 'react-input-range/lib/css/index.css';
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
            URL2Download: '',
            errorRequestSyntax: '',
            errorDuringDownload: '',
            rankBy: 'qualityOverRelevance',
            total: 0,
            activeKey: '1',
            nbDocsCalculating: false,
            compressionLevel: 0,
            archiveType: 'zip',
            samples: [],
            archiveSize: '--',
            downloadBtnClass: '',
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
        this.handlecarchivetypeByChange = this.handlecarchivetypeByChange.bind(this);
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
        this.handleClChange = this.handleClChange.bind(this);
    }

    componentWillMount() {
        const url = document.location.href;
        const shortUrl = url.slice(url.indexOf('?') + 1);
        this.interpretURL(shortUrl);
    }

    componentDidMount() {
        this.recoverFormatState();
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

    calculateNbDocs(sizeParam = config.defaultSize) {
        this.setState({
            nbDocsCalculating: true,
            total: 0,
            size: 0,
        });
        const self = this;
        const ISTEX = this.state.activeKey === '1'
            ? this.buildURLFromState(this.state.q, false)
            : this.buildURLFromState(this.transformIDorARK(), false);
        ISTEX.searchParams.delete('extract');
        ISTEX.searchParams.delete('withID');
        if (this.istexDlXhr) {
            this.istexDlXhr.abort();
        }

        // disable all before getting total 
        this.istexDlXhr = $.post(ISTEX.href + '&output=title,host.title,publicationDate,author,arkIstex&size=6', { qString: this.state.activeKey === '1' ? this.state.q : this.transformIDorARK() })
            .done((json) => {
                this.state.samples = json.hits;
                const { total } = json;
                let size, 
                    limitNbDoc = config.limitNbDoc;
                if (!total || total === 0) {
                    size = 0;
                    limitNbDoc = 0;
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
                } 

                return this.setState({
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

    transformIDorARK() {
        if (this.state.querywithIDorARK) {
            if (this.state.querywithIDorARK.includes('ark')) {
                const prefixLength = this.state.querywithIDorARK.split('/', 2).join('/').length;
                const prefix = this.state.querywithIDorARK.substring(0, prefixLength + 1);
                const res = prefix
                    .concat('("')
                    .concat(this.state.querywithIDorARK.replace(new RegExp(prefix, 'g'), ''))
                    .concat('")');
                return res.replace(new RegExp('\n', 'g'), '" "');
            }
            return 'id:('
                .concat(this.state.querywithIDorARK.match(new RegExp(`.{1,${40}}`, 'g')))
                .concat(')')
                .replace(new RegExp(',', 'g'), ' ');
        }
        return '';
    }

    setQIDFromURL(parsedUrl) {
        this.lastqId = parsedUrl.q_id;
        this.setState({
            q: parsedUrl.withID ? '' : (parsedUrl.q || ''),
            querywithIDorARK: parsedUrl.withID ? parsedUrl.q : '',
        }, () => this.calculateNbDocs(parsedUrl.size));
    }

    // eslint-disable-next-line class-methods-use-this
    characterNumberValidation() {
        return 'success';
    }
    
    setStateFromURL(parsedUrl) {
        this.lastqId = parsedUrl.q_id;
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
            compressionLevel: parsedUrl.compressionLevel || 0,
            activeKey: parsedUrl.withID ? '2' : '1',
            total: 0,
            archiveType: parsedUrl.archiveType || 'zip',
        }, () => this.calculateNbDocs(parsedUrl.size));
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
                    });
                this.setStateFromURL(parsedUrl);
            }  
        } else if (Object.keys(parsedUrl).length >= 1) {
            this.setStateFromURL(parsedUrl);
        }
    }

    waitRequest() {
        if (this.state.q.length > 0 || this.state.querywithIDorARK.length > 0) {
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
            this.timer = window.setTimeout(() => { this.calculateNbDocs(); }, 800);
        } else {
            this.setState({
                size: 0,
                total: 0,
            });
        }
    }

    handleQueryChange(event) {
        if (event) {
            if (this.state.activeKey === '1') {
                this.setState({
                    errorRequestSyntax: '',
                    q: event.query || event.target.value,
                }, () => this.waitRequest());
            } else {
                this.setState({
                    errorRequestSyntax: '',
                    querywithIDorARK: event.query || event.target.value,
                }, () => this.waitRequest());
            }
        } else {
            this.setState({
                errorRequestSyntax: '',
            }, () => this.waitRequest());
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
        this.setState({
            rankBy: name,
        }, () => this.waitRequest());
    }

    handlecarchivetypeByChange(archiveFormatEvent) {
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
        let href = `${config.apiUrl}/q_id/${this.lastqId}`;
        fetch(href, {
            method: 'POST',
            body: JSON.stringify({
                qString: this.state.activeKey === '1' ? this.state.q : this.transformIDorARK(),
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => {  
            console.log('OK setting new q_id');
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleSubmit(event) {
        const href = this.buildURLFromState();
        if (this.state.activeKey === '2') {
            // href.searchParams.set('q', this.transformIDorARK());
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


        /*
        socket = openSocket('http://localhost:8000');

        function subscribeToDownloadProgress(cb) {
            socket.emit('showDownloadProgress', 1000);
            socket.on('progressing', downloadProgress => cb(null, downloadProgress));
        }

        subscribeToDownloadProgress((err, downloadProgress) => this.setState({
            downloadProgress,
        })); */

        if ((this.state.q.length >= characterLimit && this.state.activeKey === '1') || (this.state.querywithIDorARK.length >= characterLimit && this.state.activeKey === '2')) {
            let hrefSet = `${config.apiUrl}/q_id/${this.lastqId}`;
            fetch(hrefSet, {
                method: 'POST',
                body: JSON.stringify({
                    qString: this.state.activeKey === '1' ? this.state.q : this.transformIDorARK(),
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

    handleSelectNav(eventKey) {
        if (eventKey === '3') {
            this.setState({ showModalExemple: true });
            return;
        }
        this.setState({
            activeKey: eventKey,
        }, () => this.calculateNbDocs());
    }

    handleCancel(event) {
        // socket.disconnect();
        if (window.localStorage) {
            const { href } = this.buildURLFromState();
            const url = href.slice(href.indexOf('?'));
            const formats = qs.parse(url).extract.split(';');
            const dlStorage = {
                url,
                date: new Date(),
                formats,
                size: this.state.size,
                q: this.state.activeKey === '1' ? this.state.q : this.state.querywithIDorARK,
                qId: this.state.qId,
                rankBy: this.state.rankBy,
                archiveType: this.state.archiveType,
                compressionLevel: this.state.compressionLevel,
            };
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
            const newUrl = this.buildURLFromState().href.slice(this.buildURLFromState().href.indexOf('?'));
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
    
    buildURLFromState(query = null, withHits = true) {
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
        if (this.state.qId !== undefined) {
            ISTEX.searchParams.set('q_id', this.state.qId);
        } 
        if (this.state.activeKey === '1') {
            if (this.state.q.length < characterLimit) {
                ISTEX.searchParams.delete('q_id');
                ISTEX.searchParams.set('q', query || this.state.q);
            } else {
                ISTEX.searchParams.set('q_id', this.convertMD5(1));
            }
        } else { 
            if (this.state.querywithIDorARK.length < characterLimit) {
                ISTEX.searchParams.delete('q_id');
                ISTEX.searchParams.set('q', query || this.state.querywithIDorARK);
                ISTEX.searchParams.set('withID', true);
            } else {
                ISTEX.searchParams.set('q_id', this.convertMD5(2));
                ISTEX.searchParams.set('withID', true);
            }
        } 
        // ISTEX.searchParams.set('hello', this.state.qId);
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
            this.state.downloadBtnClass = 'text-danger';
        }

        // 1GB
        if (archiveSize >= 1073741824 && archiveSize < 5368709120) {
            this.state.downloadBtnClass = 'text-warning';
        }

        // < 1GB
        if (archiveSize < 1073741824 && archiveSize > 0) {
            this.state.downloadBtnClass = 'text-success';
        }
        
        this.state.archiveSize = this.formatBytes(archiveSize);

        if (archiveSize === 0) {
            this.state.archiveSize = '--';
            this.state.downloadBtnClass = 'text-default';
        }

        return ISTEX;
    }

    convertMD5(activeKey) {
        let key;
        if (activeKey === 1) {
            key = md5(this.state.q.trim());
            sessionStorage.setItem(key, this.state.q.trim());
        } else {
            key = md5(this.state.querywithIDorARK);
            sessionStorage.setItem(key, this.state.querywithIDorARK);
        }
        this.lastqId = key;
        return key;
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
        this.setState(this.defaultState);
    }

    tryExempleRequest(queryExample, withID = false) {
        if (withID) {
            this.setState({
                activeKey: '2',
                querywithIDorARK: queryExample,
                showModalExemple: false,
            });
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
                    isDefaultState = false;
                }
            });
            if (!isDefaultState) {
                const { href } = this.buildURLFromState();
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
        if (this.usage === 2) {
            console.log('todo');
        }
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
        console.log(this.state);

        this.setState({});
    }

    checkSamples = () => {
        let samplesRes = this.state.samples;

        if (samplesRes.length > 0) {
            this.showSamplesDiv = true;
        } else {
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
                            <td className="" style={{ width: '70%', display: 'inline-block', paddingLeft: '5px' }}>{hostTitleStr}</td><td style={{ width: '30%', display: 'inline-block', textAlign: 'right' }} className="res_pubDate">{samplesRes[i].publicationDate}</td>
                        </tr>
                    </tbody>
                </table>,
            );
        }
        return samples;
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
            Pour interroger ISTEX, vous avez le choix entre différentes modes de recherche : classique ou par liste d’identifiants ARK. Pour vous aider à construire une requête par équation booléenne ou par ARK, des exemples pédagogiques vous sont proposés via le bouton "Exemples". <br />
            Si vous avez besoin de conseils, <a href="mailto:contact@listes.istex.fr">contactez l’équipe ISTEX</a>
                <br />
            </Popover>
        );

        const popoverSampleList = (
            <Popover
                id="popover-sample-list"
                title={<span> Échantillon de résultats {closingButton}</span>}
            >
            Cet échantillon de documents, classés par pertinence des résultats par rapport à votre requête,  peut vous aider à ajuster votre équation à votre besoin.  
                <br />
            </Popover>
        );

        const popoverRequestClassic = (
            <Popover
                id="popover-request-classic"
                title={<span> Recherche classique {closingButton}</span>}
            >
Pour élaborer votre équation de recherche booléenne, vous pouvez 
vous aider de l'échantillon de requêtes accessibles via le bouton "Exemples",
 de <a href="https://doc.istex.fr/tdm/requetage/" target="_blank" rel="noopener noreferrer">documentation ISTEX</a> ou bien du mode de recherche avancée du <a href="http://demo.istex.fr/" target="_blank" rel="noopener noreferrer">démonstrateur ISTEX</a>.
            </Popover>
        );

        const popoverRequestARK = (
            <Popover
                id="popover-request-ark"
                title={<span> Recherche par ARK {closingButton}</span>}
            >
Copiez/collez dans cet onglet une liste d'identifiants de type ARK et le formulaire l'interprétera automatiquement. 
Explorez ce mode de recherche en cliquant sur l’exemple disponible via le bouton "Exemples".

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
                id="popover-    -help"
                title={<span> Formats et types de fichiers {closingButton}</span>}
            >
Les différents formats et types de fichiers disponibles sont décrits dans la <a href="https://doc.istex.fr/tdm/requetage/" target="_blank" rel="noopener noreferrer">documentation ISTEX</a>. <br />
Attention : certains formats ou types de fichiers peuvent ne pas être présents pour certains documents du corpus constitué (notamment : TIFF, annexes, couvertures ou enrichissements).
            </Popover>
        );

        const popoverFiletypeHelp = (
            <Popover
                id="popover-filetype-help"
                title={<span> Usage {closingButton}</span>}
            >
Le choix d’un outil induit un remplissage des formats et types de fichiers qui seront extraits. 
L’information sur les formats et types de fichiers sélectionnés est visible dans l’URL de partage, ainsi que dans l’historique, 
une fois le corpus téléchargé. 
            </Popover>
        );

        const popoverDownloadHelp = (
            <Popover
                id="popover-download-help"
                title={<span> Téléchargement {closingButton}</span>}
            >
                La taille du corpus à télécharger dépend du nombre de documents à extraire, ainsi que des choix des types de fichiers et de formats. L’estimation fournie est une indication mais peut varier selon les documents à extraire. La couleur rouge vous avertit lorsque la taille dépasse 5 Go. 
                Sélectionnez le niveau de compression adapté à votre bande passante et à l’espace de stockage disponible sur votre disque dur. 
                Si votre corpus dépasse 4 Go, vous ne pourrez pas
                ouvrir l’archive zip sous Windows. Veuillez utiliser par exemple
                &nbsp;<a href="http://www.7-zip.org/" target="_blank" rel="noopener noreferrer">7zip</a> qui sait
                gérer les grandes tailles.
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
                <br />
                Si le nombre de documents à extraire est inférieur au nombre total des résultats correspondant à votre requête, le choix d’un mode de tri des documents peut vous intéresser (voir rubrique suivante).

            </Popover>
        );

        const popoverChoiceHelp = (
            <Popover
                id="popover-choice-help"
                title={<span> Mode de classement {closingButton}</span>}
            >
                Dans le cas où vous ne téléchargez qu’un sous-ensemble de documents par rapport aux résultats de votre requête, 
                les documents sélectionnés pour votre corpus seront extraits en fonction d’un ordre de pertinence relevé par la qualité (choix privilégié par défaut), par ordre de pertinence seulement ou tirés de manière aléatoire, 
                ce mode de tri étant plus représentatif de la diversité des résultats.
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
                                    placement="top"
                                    overlay={popoverRequestHelp}
                                >
                                    <i role="button" className="fa fa-info-circle" aria-hidden="true" />
                                </OverlayTrigger>
                                &nbsp;
                            </h2>

                            <p>
                                Sélectionnez l’un des onglets ci-dessous et explicitez ce qui décrit le corpus souhaité :

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
                                            Recherche classique
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
                                            Recherche par ARK
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
                                    <Textarea
                                        className="form-control"
                                        placeholder={this.state.activeKey === '1'
                                            ? 'brain AND language:fre'
                                            : 'ark:/67375/0T8-JMF4G14B-2\nark:/67375/0T8-RNCBH0VZ-8'
                                        }
                                        name="q"
                                        id={`area-${this.state.activeKey}`}
                                        rows="3"
                                        autoFocus="true"
                                        value={this.state.activeKey === '1'
                                            ? this.state.q
                                            : this.state.querywithIDorARK
                                        }
                                        onChange={this.handleQueryChange}
                                    />
                                </FormGroup>
                            </div>
                            {this.state.nbDocsCalculating &&
                            <p className="pTxt">
                                Calcul en cours du nombre des résultats ... 
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
                            {this.state.total === 0 && (this.state.q !== '' || this.state.querywithIDorARK !== '') &&
                            <p className="pTxt">
                                L’équation saisie correspond à 0 document
                            </p>
                            }

                            <div className="form-group col-xs-12 noPaddingLeftRight">
                                Choisir le nombre de documents souhaités
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
                                        onChange={size => this.setState({ size })
                                        }
                                    />
                                </div>
                                &nbsp;&nbsp; <span className={this.limitNbDocClass}>/ {this.state.limitNbDoc}</span>
                                {}
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
                                    Relevé par qualité
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
                            <p>Cliquez sur l’usage que vous souhaitez faire de votre corpus. <br />
                            La sélection du mode "Usage personnalisé" donne accès à tous les types de fichiers et de formats existants dans ISTEX.</p>
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
                                        onChange={this.handlecarchivetypeByChange}
                                    >
                                        ZIP
                                    </Radio>
                                    &nbsp;&nbsp;&nbsp;
                                    <Radio
                                        id="radioTar"
                                        inline
                                        name="tar"
                                        checked={this.state.archiveType === 'tar'}
                                        onChange={this.handlecarchivetypeByChange}
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
                                        <td className="btn-td1">Taille estimée : <span className={this.state.downloadBtnClass}>{this.state.archiveSize}</span></td>
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
                                    onClick={() => this.tryExempleRequest(Labelize.astrophysique)}
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
                                    onClick={() => this.tryExempleRequest(Labelize.zoologie)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des données bibliographiques et des indicateurs de qualité
                        </div>
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
                            des données bibliographiques et des troncatures sur des mots-clés
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.motClefsSystematiqueVegetale)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des troncatures sur des mots-clés et des opérateurs booléens imbriqués
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.regExpSystematiqueVegetale)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des expressions régulières sur des mots-clés (I)
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.regExpArctic)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                             des expressions régulières sur des mots-clés (II)
                        </div>
                        <div className="exempleRequestLine">
                            <span className="exampleRequest">
                                <OverlayTrigger
                                    rootClose
                                    overlay={tryRequestTooltip}
                                    placement="top"
                                    onClick={() => this.tryExempleRequest(Labelize.opArctic)}
                                >
                                    <i role="button" className="fa fa-search" aria-hidden="true" />
                                </OverlayTrigger>
                            </span>
                            des troncatures, de la recherche floue et des opérateurs de proximité
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
