import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompressionLevel, setArchiveType } from '../../store/istexApiSlice';
import DownloadButton from '../DownloadButton/DownloadButton';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { istexApiConfig } from '../../config';
import TitleSection from '../TitleSection/TitleSection';

export default function DownloadSection () {
  const dispatch = useDispatch();
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);

  const compressionLevelHandler = newCompressionLevel => {
    dispatch(setCompressionLevel(newCompressionLevel));

    eventEmitter.emit(events.setCompressionLevelUrlParam, newCompressionLevel);
    eventEmitter.emit(events.setCompressionLevelInLastRequestOfHistory, newCompressionLevel);
  };

  const archiveTypeHandler = newArchiveType => {
    dispatch(setArchiveType(newArchiveType));

    eventEmitter.emit(events.setArchiveTypeUrlParam, newArchiveType);
    eventEmitter.emit(events.setArchiveTypeInLastRequestOfHistory, newArchiveType);
  };

  useEffect(() => {
    eventEmitter.addListener(events.setCompressionLevel, compressionLevelHandler);
    eventEmitter.addListener(events.setArchiveType, archiveTypeHandler);
  }, []);

  return (
    <div className='text-center my-12 font-opensans font-[14px]'>
      <TitleSection
        title='Téléchargement'
        num='3'
        infoTextTitle=''
        infoTextContent={
          <p className='text-sm text-white'>
            Une estimation de la taille du corpus<br />
            s’affiche dans le bouton "télécharger"<br />
            lorsqu’elle excède 1 Go.<br />
            Dans le cas d’un corpus volumineux,<br />
            sélectionnez le niveau de<br />
            compression approprié à votre<br />
            bande passante et à l’espace de<br />
            stockage disponible sur votre disque<br />
            dur.<br />
            En cas de difficultés lors de<br />
            l’ouverture de l’archive zip avec les<br />
            outils Windows natifs, utilisez par<br />
            exemple le logiciel libre <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-'>7-zip</a>.<br />
            Voir la <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-'>documentation ISTEX</a> ou bien<br />
          </p>
        }
      />
      <div className='flex items-center justify-center mt-4 text-base'>
        <div className='mr-8'>
          <span className='pr-2'>Niveau de compression : </span>
          <select
            value={compressionLevel}
            onChange={event => {
              let { value } = event.target;
              value = parseInt(value);
              compressionLevelHandler(value);
            }}
            className='bg-white pl-4 py-2 text-sm'
          >
            {istexApiConfig.compressionLevels.levels.map(level => (
              <option key={level.label} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className='pr-2'>Format de l'archive : </span>
          {istexApiConfig.archiveTypes.types.map(type => (
            <span key={type.value} className='pr-4'>
              <input
                type='radio'
                checked={archiveType === type.value}
                value={type.value}
                name='archiveType'
                onChange={event => {
                  const { value } = event.target;
                  archiveTypeHandler(value);
                }}
              />
              <label className='pl-2' htmlFor={type.value}>{type.label.toUpperCase()}</label>
            </span>
          ))}
        </div>
      </div>
      <DownloadButton />
    </div>
  );
}
