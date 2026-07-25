import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorsModule } from './connectors.module';
import { ConnectorsService } from './connectors.service';

describe('ConnectorsService', () => {
  let service: ConnectorsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ConnectorsModule],
    }).compile();

    service = moduleRef.get(ConnectorsService);
  });

  it('lists all available connectors', () => {
    const connectors = service.list();
    expect(connectors.length).toBeGreaterThan(0);
    connectors.forEach((connector) => {
      expect(connector.id).toBeDefined();
      expect(connector.name).toBeDefined();
    });
  });

  it('returns health status for all connectors', async () => {
    const results = await service.health();
    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => {
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
  });

  it('returns not found for sync on an unknown connector', async () => {
    const result = await service.sync('unknown-connector-id');
    expect(result.success).toBe(false);
  });

  it('returns not found for search on an unknown connector', async () => {
    const result = await service.search('unknown-connector-id', 'test query');
    expect(result.success).toBe(false);
  });

  it('syncs a known connector', async () => {
    const connectors = service.list();
    const first = connectors[0]!;
    const result = await service.sync(first.id);
    expect(result.success).toBeDefined();
  });

  it('searches via a known connector', async () => {
    const connectors = service.list();
    const first = connectors[0]!;
    const result = await service.search(first.id, 'README');
    expect(result.success).toBeDefined();
  });
});
