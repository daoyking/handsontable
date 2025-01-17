describe('Core.emptySelectedCells', () => {
  beforeEach(function() {
    this.$container = $('<div id="testContainer"></div>').appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should make all selected cells empty', () => {
    handsontable({
      data: Handsontable.helper.createSpreadsheetObjectData(9, 8),
      selectionMode: 'multiple',
    });

    $(getCell(5, 4)).simulate('mousedown');
    $(getCell(1, 1)).simulate('mouseover');
    $(getCell(1, 1)).simulate('mouseup');

    keyDown('control/meta');

    $(getCell(2, 2)).simulate('mousedown');
    $(getCell(7, 2)).simulate('mouseover');
    $(getCell(7, 2)).simulate('mouseup');

    $(getCell(2, 4)).simulate('mousedown');
    $(getCell(2, 4)).simulate('mouseover');
    $(getCell(2, 4)).simulate('mouseup');

    $(getCell(7, 6)).simulate('mousedown');
    $(getCell(8, 7)).simulate('mouseover');
    $(getCell(8, 7)).simulate('mouseup');

    keyUp('control/meta');

    emptySelectedCells();

    /* eslint-disable no-multi-spaces, comma-spacing */
    const snapshot = [
      ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'],
      ['A2', null, null, null, null, 'F2', 'G2', 'H2'],
      ['A3', null, null, null, null, 'F3', 'G3', 'H3'],
      ['A4', null, null, null, null, 'F4', 'G4', 'H4'],
      ['A5', null, null, null, null, 'F5', 'G5', 'H5'],
      ['A6', null, null, null, null, 'F6', 'G6', 'H6'],
      ['A7', 'B7', null, 'D7', 'E7', 'F7', 'G7', 'H7'],
      ['A8', 'B8', null, 'D8', 'E8', 'F8', null, null,],
      ['A9', 'B9', 'C9', 'D9', 'E9', 'F9', null, null,],
    ];
    /* eslint-enable no-multi-spaces, comma-spacing */

    expect(getData()).toEqual(snapshot);
  });

  it('should not throw an error when method is called when all headers are selected', () => {
    handsontable({
      data: Handsontable.helper.createSpreadsheetData(5, 5),
      rowHeaders: true,
      colHeaders: true,
    });

    selectAll();

    expect(() => {
      emptySelectedCells();
    }).not.toThrowError();
  });

  it('should not be performed, when there are no rows (even when there are headers selected)', () => {
    // We're using the `beforeChange` hook, as the `emptySelectedCells` method ends up doing a bunch of changes to
    // clear the selected cells.
    const onBeforeChange = jasmine.createSpy('beforeChange');

    handsontable({
      startRows: 0,
      startCols: 1,
      rowHeaders: true,
      colHeaders: true,
      beforeChange: onBeforeChange
    });

    simulateClick(spec().$container.find('.ht_clone_top tr:eq(0) th:eq(0)'));

    emptySelectedCells();

    expect(onBeforeChange).not.toHaveBeenCalled();
  });

  it('should not be performed, when there are no columns (even when there are headers selected)', () => {
    // We're using the `beforeChange` hook, as the `emptySelectedCells` method ends up doing a bunch of changes to
    // clear the selected cells.
    const onBeforeChange = jasmine.createSpy('beforeChange');

    handsontable({
      startRows: 1,
      startCols: 0,
      rowHeaders: true,
      colHeaders: true,
      beforeChange: onBeforeChange
    });

    simulateClick(spec().$container.find('.ht_clone_inline_start tr:eq(1) th:eq(0)'));

    emptySelectedCells();

    expect(onBeforeChange).not.toHaveBeenCalled();
  });

  it('should not be performed, when all rows are trimmed (even when there are headers selected)', () => {
    // We're using the `beforeChange` hook, as the `emptySelectedCells` method ends up doing a bunch of changes to
    // clear the selected cells.
    const onBeforeChange = jasmine.createSpy('beforeChange');

    handsontable({
      startRows: 2,
      startCols: 1,
      trimRows: [0, 1], // TODO: The TrimmingMap should be used instead of the plugin.
      rowHeaders: true,
      colHeaders: true,
      beforeChange: onBeforeChange
    });

    simulateClick(spec().$container.find('.ht_clone_top tr:eq(0) th:eq(0)'));

    emptySelectedCells();

    expect(onBeforeChange).not.toHaveBeenCalled();
  });
});
