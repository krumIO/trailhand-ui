import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { html } from 'lit';
import './data-table';
import type { DataTable, DataTableColumn } from './data-table';
import type { Checkbox } from '../checkbox/checkbox';

const COLUMNS: DataTableColumn[] = [
  { field: 'name', label: 'Name' },
  { field: 'replicas', label: 'Replicas' },
  { field: 'meta.namespace', label: 'Namespace' },
];

const ROWS = [
  { id: 1, name: 'charlie', replicas: 3, meta: { namespace: 'workspace' } },
  { id: 2, name: 'alpha', replicas: 1, meta: { namespace: 'default' } },
  { id: 3, name: 'bravo', replicas: 2, meta: { namespace: 'workspace' } },
];

describe('DataTable', () => {
  let el: DataTable;

  const bodyRows = () =>
    Array.from(el.shadowRoot!.querySelectorAll('tbody tr'));
  const columnValues = (index: number) =>
    bodyRows().map((tr) => {
      const cells = tr.querySelectorAll('td:not(.data-table__td--selection)');
      return cells[index].textContent!.trim();
    });
  const headers = () =>
    Array.from(
      el.shadowRoot!.querySelectorAll<HTMLElement>(
        'th:not(.data-table__th--selection):not(.data-table__th--actions)',
      ),
    );
  const clickHeader = async (index: number) => {
    headers()[index].click();
    await el.updateComplete;
  };

  beforeEach(async () => {
    el = document.createElement('trailhand-table') as DataTable;
    el.columns = COLUMNS;
    el.rows = ROWS;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('Rendering', () => {
    it('renders a header per column', () => {
      expect(headers().map((th) => th.textContent!.trim())).toEqual([
        'Name',
        'Replicas',
        'Namespace',
      ]);
    });

    it('renders a row per item in original order', () => {
      expect(columnValues(0)).toEqual(['charlie', 'alpha', 'bravo']);
    });

    it('resolves dot-notation fields', () => {
      expect(columnValues(2)).toEqual(['workspace', 'default', 'workspace']);
    });

    it('shows empty message when there are no rows', async () => {
      el.rows = [];
      el.emptyMessage = 'Nothing here';
      await el.updateComplete;
      const empty = el.shadowRoot!.querySelector('.data-table__td--empty');
      expect(empty!.textContent).toContain('Nothing here');
    });

    it('shows spinner instead of rows while loading', async () => {
      el.loading = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.data-table__spinner')).not.toBeNull();
      expect(bodyRows().length).toBe(1);
    });
  });

  describe('Sorting', () => {
    it('sorts ascending on first header click', async () => {
      await clickHeader(0);
      expect(columnValues(0)).toEqual(['alpha', 'bravo', 'charlie']);
      expect(headers()[0].classList.contains('data-table__th--sorted')).toBe(true);
    });

    it('toggles to descending on second click', async () => {
      await clickHeader(0);
      await clickHeader(0);
      expect(columnValues(0)).toEqual(['charlie', 'bravo', 'alpha']);
    });

    it('resets to ascending when switching columns', async () => {
      await clickHeader(0);
      await clickHeader(0);
      await clickHeader(1);
      expect(columnValues(1)).toEqual(['1', '2', '3']);
    });

    it('shows chevron-down icon when descending', async () => {
      await clickHeader(0);
      await clickHeader(0);
      const icon = headers()[0].querySelector('iconify-icon');
      expect(icon!.getAttribute('icon')).toBe('heroicons:chevron-down-20-solid');
    });

    it('sorts on nested fields', async () => {
      await clickHeader(2);
      expect(columnValues(2)).toEqual(['default', 'workspace', 'workspace']);
    });

    it('ignores clicks on a column with sortable: false', async () => {
      el.columns = [{ ...COLUMNS[0], sortable: false }, COLUMNS[1]];
      await el.updateComplete;
      await clickHeader(0);
      expect(columnValues(0)).toEqual(['charlie', 'alpha', 'bravo']);
      expect(headers()[0].querySelector('iconify-icon')).toBeNull();
    });

    it('ignores clicks when table sortable is false', async () => {
      el.sortable = false;
      await el.updateComplete;
      await clickHeader(0);
      expect(columnValues(0)).toEqual(['charlie', 'alpha', 'bravo']);
    });

    it('uses a custom sortFn with direction', async () => {
      const sortFn = vi.fn((a, b, dir) => {
        const cmp = a.name.length - b.name.length || a.name.localeCompare(b.name);
        return dir === 'asc' ? cmp : -cmp;
      });
      el.columns = [{ ...COLUMNS[0], sortFn }, COLUMNS[1]];
      await el.updateComplete;

      await clickHeader(0);
      expect(columnValues(0)).toEqual(['alpha', 'bravo', 'charlie']);
      expect(sortFn.mock.calls[0][2]).toBe('asc');

      await clickHeader(0);
      expect(columnValues(0)).toEqual(['charlie', 'bravo', 'alpha']);
    });

    it('resetSort restores original order', async () => {
      await clickHeader(0);
      el.resetSort();
      await el.updateComplete;
      expect(columnValues(0)).toEqual(['charlie', 'alpha', 'bravo']);
    });

    it('sort returns to page 1', async () => {
      el.rowsPerPage = 2;
      await el.updateComplete;
      el.goToPage(2);
      await el.updateComplete;
      await clickHeader(0);
      expect(columnValues(0)).toEqual(['alpha', 'bravo']);
    });
  });

  describe('Search', () => {
    const search = async (query: string) => {
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(
        '.data-table__search-input',
      )!;
      input.value = query;
      input.dispatchEvent(new Event('input'));
      await el.updateComplete;
    };

    it('filters rows case-insensitively', async () => {
      await search('ALP');
      expect(columnValues(0)).toEqual(['alpha']);
    });

    it('skips columns with searchable: false', async () => {
      el.columns = [COLUMNS[0], { ...COLUMNS[2], searchable: false }];
      await el.updateComplete;
      await search('default');
      expect(el.shadowRoot!.querySelector('.data-table__td--empty')).not.toBeNull();
    });

    it('shows no-results message when nothing matches', async () => {
      await search('zzz');
      const empty = el.shadowRoot!.querySelector('.data-table__td--empty');
      expect(empty!.textContent).toContain('No results found');
    });

    it('does not render search input when searchable is false', async () => {
      el.searchable = false;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.data-table__search-input')).toBeNull();
    });
  });

  describe('Formatters', () => {
    it('applies a function formatter with value and row', async () => {
      const formatter = vi.fn((value, row) => `${value}/${row.id}`);
      el.columns = [{ field: 'replicas', label: 'Replicas', formatter }];
      await el.updateComplete;
      expect(formatter).toHaveBeenCalledWith(3, ROWS[0]);
      expect(columnValues(0)).toEqual(['3/1', '1/2', '2/3']);
    });

    it('renders a TemplateResult returned by a formatter', async () => {
      el.columns = [
        {
          field: 'name',
          label: 'Name',
          formatter: (v) => html`<strong class="fmt">${v}</strong>`,
        },
      ];
      await el.updateComplete;
      const strong = el.shadowRoot!.querySelectorAll('strong.fmt');
      expect(strong.length).toBe(3);
      expect(strong[0].textContent).toBe('charlie');
    });

    it('applies a named string formatter', async () => {
      el.rows = [{ id: 1, mem: 2048 }];
      el.columns = [{ field: 'mem', label: 'Memory', formatter: 'memory' }];
      await el.updateComplete;
      expect(columnValues(0)).toEqual(['2 KB']);
    });

    it('falls back to raw value for unknown string formatter', async () => {
      el.columns = [{ field: 'name', label: 'Name', formatter: 'nope' }];
      await el.updateComplete;
      expect(columnValues(0)).toEqual(['charlie', 'alpha', 'bravo']);
    });

    it('sorts on raw value, not formatted value', async () => {
      el.columns = [
        { field: 'replicas', label: 'Replicas', formatter: (v) => `x${10 - v}` },
      ];
      await el.updateComplete;
      await clickHeader(0);
      expect(columnValues(0)).toEqual(['x9', 'x8', 'x7']);
    });
  });

  describe('Links', () => {
    it('renders internal link and emits navigate instead of following it', async () => {
      el.columns = [{ field: 'name', label: 'Name', link: (r) => `/apps/${r.name}` }];
      await el.updateComplete;
      const listener = vi.fn();
      el.addEventListener('navigate', listener);

      const a = el.shadowRoot!.querySelector<HTMLAnchorElement>('tbody a')!;
      expect(a.getAttribute('href')).toBe('/apps/charlie');
      a.click();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail).toEqual({
        url: '/apps/charlie',
        row: ROWS[0],
      });
    });

    it('renders external links with target and rel when linkTarget is _blank', async () => {
      el.rows = [{ id: 1, name: 'x', url: 'https://example.com' }];
      el.columns = [{ field: 'name', label: 'Name', link: 'url', linkTarget: '_blank' }];
      await el.updateComplete;
      const a = el.shadowRoot!.querySelector<HTMLAnchorElement>('tbody a')!;
      expect(a.getAttribute('href')).toBe('https://example.com');
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  describe('renderActions', () => {
    it('does not render an actions column by default', () => {
      expect(el.shadowRoot!.querySelector('.data-table__th--actions')).toBeNull();
      expect(el.shadowRoot!.querySelector('.data-table__td--actions')).toBeNull();
    });

    it('calls renderActions per row and renders its output', async () => {
      const renderActions = vi.fn(
        (row) => html`<button class="row-action">${row.name}</button>`,
      );
      el.renderActions = renderActions;
      await el.updateComplete;

      expect(renderActions).toHaveBeenCalledTimes(3);
      expect(renderActions).toHaveBeenCalledWith(ROWS[0]);
      expect(el.shadowRoot!.querySelector('.data-table__th--actions')).not.toBeNull();
      const buttons = el.shadowRoot!.querySelectorAll('.data-table__td--actions .row-action');
      expect(Array.from(buttons).map((b) => b.textContent)).toEqual([
        'charlie',
        'alpha',
        'bravo',
      ]);
    });

    it('renders a trailhand-action-menu returned from renderActions', async () => {
      await import('../action-menu/action-menu');
      el.renderActions = (row) =>
        html`<trailhand-action-menu .resource=${row}></trailhand-action-menu>`;
      await el.updateComplete;
      const menus = el.shadowRoot!.querySelectorAll('trailhand-action-menu');
      expect(menus.length).toBe(3);
      expect((menus[1] as unknown as { resource: unknown }).resource).toBe(ROWS[1]);
    });

    it('includes actions and selection columns in empty-state colspan', async () => {
      el.rows = [];
      el.selectable = true;
      el.renderActions = () => html``;
      await el.updateComplete;
      const td = el.shadowRoot!.querySelector('.data-table__td--empty');
      expect(td!.getAttribute('colspan')).toBe('5');
    });
  });

  describe('Row selection', () => {
    const rowCheckboxes = () =>
      Array.from(
        el.shadowRoot!.querySelectorAll<Checkbox>('td.data-table__td--selection trailhand-checkbox'),
      );
    const headerCheckbox = () =>
      el.shadowRoot!.querySelector<Checkbox>('th.data-table__th--selection trailhand-checkbox')!;
    const fire = async (cb: Element) => {
      cb.dispatchEvent(new CustomEvent('checkbox-change', { bubbles: true, composed: true }));
      await el.updateComplete;
    };

    let lastDetail: { selectedKeys: unknown[]; selectedRows: unknown[] } | null;

    beforeEach(async () => {
      lastDetail = null;
      el.addEventListener('selection-change', (e) => {
        lastDetail = (e as CustomEvent).detail;
      });
      el.selectable = true;
      await el.updateComplete;
    });

    it('does not render checkboxes when selectable is false', async () => {
      el.selectable = false;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('trailhand-checkbox')).toBeNull();
    });

    it('renders a checkbox per row plus a header checkbox', () => {
      expect(rowCheckboxes().length).toBe(3);
      expect(headerCheckbox()).not.toBeNull();
    });

    it('selects and deselects a row', async () => {
      await fire(rowCheckboxes()[1]);
      expect(lastDetail!.selectedKeys).toEqual([2]);
      expect(lastDetail!.selectedRows).toEqual([ROWS[1]]);
      expect(rowCheckboxes()[1].checked).toBe(true);

      await fire(rowCheckboxes()[1]);
      expect(lastDetail!.selectedKeys).toEqual([]);
      expect(rowCheckboxes()[1].checked).toBe(false);
    });

    it('header checkbox is indeterminate when some rows are selected', async () => {
      await fire(rowCheckboxes()[0]);
      expect(headerCheckbox().indeterminate).toBe(true);
      expect(headerCheckbox().checked).toBe(false);
    });

    it('header checkbox selects all, then deselects all', async () => {
      await fire(headerCheckbox());
      expect(lastDetail!.selectedKeys).toEqual([1, 2, 3]);
      expect(headerCheckbox().checked).toBe(true);
      expect(headerCheckbox().indeterminate).toBe(false);

      await fire(headerCheckbox());
      expect(lastDetail!.selectedKeys).toEqual([]);
    });

    it('header checkbox completes a partial selection', async () => {
      await fire(rowCheckboxes()[0]);
      await fire(headerCheckbox());
      expect(lastDetail!.selectedKeys.sort()).toEqual([1, 2, 3]);
    });

    it('uses keyField to identify rows', async () => {
      el.keyField = 'name';
      await el.updateComplete;
      await fire(rowCheckboxes()[0]);
      expect(lastDetail!.selectedKeys).toEqual(['charlie']);
    });

    it('disables and skips rows rejected by rowSelectable', async () => {
      el.rowSelectable = (row) => row.id !== 2;
      await el.updateComplete;
      expect(rowCheckboxes()[1].disabled).toBe(true);

      await fire(rowCheckboxes()[1]);
      expect(lastDetail).toBeNull();

      await fire(headerCheckbox());
      expect(lastDetail!.selectedKeys).toEqual([1, 3]);
      expect(headerCheckbox().checked).toBe(true);
    });

    it('header checkbox only affects the current page', async () => {
      el.rowsPerPage = 2;
      await el.updateComplete;
      await fire(headerCheckbox());
      expect(lastDetail!.selectedKeys).toEqual([1, 2]);
    });

    it('selection persists across pages', async () => {
      el.rowsPerPage = 2;
      await el.updateComplete;
      await fire(rowCheckboxes()[0]);
      el.goToPage(2);
      await el.updateComplete;
      await fire(rowCheckboxes()[0]);
      expect(lastDetail!.selectedKeys).toEqual([1, 3]);
    });

    it('selection persists when rows are replaced', async () => {
      await fire(rowCheckboxes()[0]);
      el.rows = [{ id: 9, name: 'zulu', replicas: 0, meta: { namespace: 'x' } }];
      await el.updateComplete;
      await fire(rowCheckboxes()[0]);
      expect(lastDetail!.selectedKeys).toEqual([1, 9]);
    });

    it('clearSelection empties selection and emits', async () => {
      await fire(rowCheckboxes()[0]);
      el.clearSelection();
      await el.updateComplete;
      expect(lastDetail!.selectedKeys).toEqual([]);
      expect(rowCheckboxes()[0].checked).toBe(false);
    });
  });

  describe('Pagination', () => {
    beforeEach(async () => {
      el.rowsPerPage = 2;
      await el.updateComplete;
    });

    it('slices rows to rowsPerPage', () => {
      expect(columnValues(0)).toEqual(['charlie', 'alpha']);
    });

    it('goToPage emits page-change and shows the next page', async () => {
      const listener = vi.fn();
      el.addEventListener('page-change', listener);
      el.goToPage(2);
      await el.updateComplete;
      expect(columnValues(0)).toEqual(['bravo']);
      expect(listener.mock.calls[0][0].detail).toEqual({ page: 2 });
    });

    it('ignores out-of-range pages', async () => {
      const listener = vi.fn();
      el.addEventListener('page-change', listener);
      el.goToPage(5);
      el.goToPage(0);
      await el.updateComplete;
      expect(listener).not.toHaveBeenCalled();
    });

    it('hides pagination when everything fits on one page', async () => {
      el.rowsPerPage = 10;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('trailhand-pagination')).toBeNull();
    });

    it('server-side mode renders rows as given and uses totalItems', async () => {
      el.serverSide = true;
      el.totalItems = 10;
      el.currentPage = 3;
      await el.updateComplete;
      expect(bodyRows().length).toBe(3);
      const pager = el.shadowRoot!.querySelector('trailhand-pagination')!;
      expect(pager.getAttribute('total-pages')).toBe('5');
      expect(pager.getAttribute('current-page')).toBe('3');
    });
  });
});
