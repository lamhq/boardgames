import { Transport } from './transport';
import { ProcessGameConfig } from '@boardgameio/core/game';

describe('Transport', () => {
  class SimpleTransport extends Transport {
    connect() {}
    disconnect() {}
    sendAction() {}
    sendChatMessage() {}
    requestSync() {}
    updateMatchID() {}
    updatePlayerID() {}
    updateCredentials() {}
    get(key: 'connectionStatusCallback') {
      return this[key].bind(this);
    }
  }

  test('base class sets up callbacks', () => {
    const transport = new SimpleTransport({
      transportDataCallback: () => {},
      game: ProcessGameConfig({}),
      gameKey: {},
    });
    expect(transport.get('connectionStatusCallback')()).toBeUndefined();
  });
});
