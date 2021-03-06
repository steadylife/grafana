import React from 'react';
import { shallow } from 'enzyme';
import Thresholds from './Thresholds';
import { defaultProps, OptionsProps } from './module';
import { PanelOptionsProps } from '../../../types';

const setup = (propOverrides?: object) => {
  const props: PanelOptionsProps<OptionsProps> = {
    onChange: jest.fn(),
    options: {
      ...defaultProps.options,
      thresholds: [
        { index: 0, label: 'Min', value: 0, canRemove: false, color: 'rgba(50, 172, 45, 0.97)' },
        { index: 1, label: 'Max', value: 100, canRemove: false },
      ],
    },
  };

  Object.assign(props, propOverrides);

  return shallow(<Thresholds {...props} />).instance() as Thresholds;
};

describe('Add threshold', () => {
  it('should add threshold between min and max', () => {
    const instance = setup();

    instance.onAddThreshold(1);

    expect(instance.state.thresholds).toEqual([
      { index: 0, label: 'Min', value: 0, canRemove: false, color: 'rgba(50, 172, 45, 0.97)' },
      { index: 1, label: '', value: 50, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
      { index: 2, label: 'Max', value: 100, canRemove: false },
    ]);
  });

  it('should add threshold between min and added threshold', () => {
    const instance = setup({
      options: {
        ...defaultProps.options,
        thresholds: [
          { index: 0, label: 'Min', value: 0, canRemove: false, color: 'rgba(50, 172, 45, 0.97)' },
          { index: 1, label: '', value: 50, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
          { index: 2, label: 'Max', value: 100, canRemove: false },
        ],
      },
    });

    instance.onAddThreshold(1);

    expect(instance.state.thresholds).toEqual([
      { index: 0, label: 'Min', value: 0, canRemove: false, color: 'rgba(50, 172, 45, 0.97)' },
      { index: 1, label: '', value: 25, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
      { index: 2, label: '', value: 50, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
      { index: 3, label: 'Max', value: 100, canRemove: false },
    ]);
  });
});

describe('Add at index', () => {
  it('should return 1, no added thresholds', () => {
    const instance = setup();

    const result = instance.insertAtIndex(1);

    expect(result).toEqual(1);
  });

  it('should return 1, one added threshold', () => {
    const instance = setup();
    instance.state = {
      thresholds: [
        { index: 0, label: 'Min', value: 0, canRemove: false },
        { index: 1, label: '', value: 50, canRemove: true },
        { index: 2, label: 'Max', value: 100, canRemove: false },
      ],
    };

    const result = instance.insertAtIndex(1);

    expect(result).toEqual(1);
  });

  it('should return 2, two added thresholds', () => {
    const instance = setup({
      options: {
        thresholds: [
          { index: 0, label: 'Min', value: 0, canRemove: false },
          { index: 1, label: '', value: 25, canRemove: true },
          { index: 2, label: '', value: 50, canRemove: true },
          { index: 3, label: 'Max', value: 100, canRemove: false },
        ],
      },
    });

    const result = instance.insertAtIndex(2);

    expect(result).toEqual(2);
  });

  it('should return 2, one added threshold', () => {
    const instance = setup();
    instance.state = {
      thresholds: [
        { index: 0, label: 'Min', value: 0, canRemove: false },
        { index: 1, label: '', value: 50, canRemove: true },
        { index: 2, label: 'Max', value: 100, canRemove: false },
      ],
    };

    const result = instance.insertAtIndex(2);

    expect(result).toEqual(2);
  });
});

describe('change threshold value', () => {
  it('should update value and resort rows', () => {
    const instance = setup();
    const mockThresholds = [
      { index: 0, label: 'Min', value: 0, canRemove: false, color: 'rgba(50, 172, 45, 0.97)' },
      { index: 1, label: '', value: 50, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
      { index: 2, label: '', value: 75, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
      { index: 3, label: 'Max', value: 100, canRemove: false },
    ];

    instance.state = {
      thresholds: mockThresholds,
    };

    const mockEvent = { target: { value: 78 } };

    instance.onChangeThresholdValue(mockEvent, mockThresholds[1]);

    expect(instance.state.thresholds).toEqual([
      { index: 0, label: 'Min', value: 0, canRemove: false, color: 'rgba(50, 172, 45, 0.97)' },
      { index: 1, label: '', value: 78, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
      { index: 2, label: '', value: 75, canRemove: true, color: 'rgba(237, 129, 40, 0.89)' },
      { index: 3, label: 'Max', value: 100, canRemove: false },
    ]);
  });
});
