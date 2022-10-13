import * as React from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Skeleton,
  ValidatedOptions,
} from '@patternfly/react-core';

import { filter } from './utils';

type PersistentVolumeSelectNameProps = {
  isDisabled: boolean;
  pvcNameSelected: string;
  pvcNames: string[];
  onChange: (newPVCName: string) => void;
  isLoading?: boolean;
};

export const PersistentVolumeSelectName: React.FC<PersistentVolumeSelectNameProps> = ({
  isDisabled,
  pvcNameSelected,
  pvcNames,
  onChange,
  isLoading,
}) => {
  const { t } = useKubevirtTranslation();
  const [isOpen, setSelectOpen] = React.useState(false);

  const onSelect = React.useCallback(
    (event, selection) => {
      onChange(selection);
      setSelectOpen(false);
    },
    [onChange],
  );

  const fieldId = 'pvc-name-select';

  if (isLoading) {
    return (
      <>
        <br />
        <Skeleton fontSize="lg" className="pvc-selection-formgroup" />
        <br />
      </>
    );
  }

  return (
    <FormGroup
      label={t('Persistent Volume Claim name')}
      fieldId={fieldId}
      id={fieldId}
      isRequired
      className="pvc-selection-formgroup"
    >
      <Select
        aria-labelledby={fieldId}
        isOpen={isOpen}
        onToggle={() => setSelectOpen(!isOpen)}
        onSelect={onSelect}
        variant={SelectVariant.typeahead}
        selections={pvcNameSelected}
        onFilter={filter(pvcNames)}
        placeholderText={t('--- Select PersistentVolumeClaim name ---')}
        isDisabled={isDisabled}
        validated={!pvcNameSelected ? ValidatedOptions.error : ValidatedOptions.default}
        aria-invalid={!pvcNameSelected ? true : false}
        maxHeight={400}
        menuAppendTo="parent"
      >
        {pvcNames.map((name) => (
          <SelectOption key={name} value={name} />
        ))}
      </Select>
    </FormGroup>
  );
};
