import { describe, expect, it } from 'vitest';
import localStorage from './localStorage';

describe('Tests for the LocalStorage class', () => {
  it('getAll', () => {
    localStorage.add({ foo: 'bar' });
    localStorage.add({ hello: 'world' });
    expect(localStorage.getAll()).to.deep.equal([{ hello: 'world' }, { foo: 'bar' }]);
    localStorage.remove(1);
    localStorage.remove(0);
  });

  it('get', () => {
    localStorage.add({ foo: 'bar' });
    expect(localStorage.get(0)).to.deep.equal({ foo: 'bar' });
    localStorage.remove(0);
  });

  it('add', () => {
    expect(localStorage.getAll()).to.deep.equal([]);
    localStorage.add({ foo: 'bar' });
    expect(localStorage.getAll()).to.deep.equal([{ foo: 'bar' }]);
    localStorage.remove(0);
  });

  it('remove', () => {
    localStorage.add({ foo: 'bar' });
    expect(localStorage.getAll()).to.deep.equal([{ foo: 'bar' }]);
    localStorage.remove(0);
    expect(localStorage.getAll()).to.deep.equal([]);
  });

  it('modify', () => {
    localStorage.add({ foo: 'bar' });
    expect(localStorage.getAll()).to.deep.equal([{ foo: 'bar' }]);
    localStorage.modify(0, { foo: 'biz' });
    expect(localStorage.getAll()).to.deep.equal([{ foo: 'biz' }]);
    localStorage.remove(0);
  });

  it('_update', () => {
    localStorage._elements.push({ foo: 'bar' });
    expect(window.localStorage.getItem('istex-dl')).to.equal('[]');
    localStorage._update();
    expect(window.localStorage.getItem('istex-dl')).to.equal('[{"foo":"bar"}]');
  });
});
