import * as React from 'react';
import produce from 'immer';
import { useDeschedulerOn } from 'src/views/templates/utils';

import { TemplateModel, V1Template } from '@kubevirt-ui/kubevirt-api/console';
import TabModal from '@kubevirt-utils/components/TabModal/TabModal';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { DESCHEDULER_EVICT_LABEL } from '@kubevirt-utils/resources/vmi';
import { k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import { Alert, AlertVariant, Checkbox, Form, FormGroup } from '@patternfly/react-core';

const ensurePath = <T extends object>(data: T, paths: string | string[]) => {
  let current = data;

  if (Array.isArray(paths)) {
    paths.forEach((path) => ensurePath(data, path));
  } else {
    const keys = paths.split('.');

    for (const key of keys) {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }
};

type DeschedulerModalProps = {
  template: V1Template;
  isOpen: boolean;
  onClose: () => void;
};

const DeschedulerModal: React.FC<DeschedulerModalProps> = ({ template, isOpen, onClose }) => {
  const { t } = useKubevirtTranslation();
  const [isOn, setOn] = React.useState<boolean>(useDeschedulerOn(template)); // the default is OFF, the admin has to opt-in this feature

  const onSubmit = React.useCallback(
    (updatedTemplate: V1Template) =>
      k8sUpdate({
        model: TemplateModel,
        data: updatedTemplate,
        ns: updatedTemplate?.metadata?.namespace,
        name: updatedTemplate?.metadata?.name,
      }),
    [],
  );

  const updatedTemplate = React.useMemo(() => {
    return produce<V1Template>(template, (draft: V1Template) => {
      ensurePath(draft, 'spec.template.metadata.annotations');
      if (!draft.objects[0].spec.template.metadata.annotations)
        draft.objects[0].spec.template.metadata.annotations = {};
      if (isOn) {
        draft.objects[0].spec.template.metadata.annotations[DESCHEDULER_EVICT_LABEL] = 'true';
      } else {
        delete draft.objects[0].spec.template.metadata.annotations[DESCHEDULER_EVICT_LABEL];
      }
    });
  }, [template, isOn]);

  return (
    <TabModal
      obj={updatedTemplate}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      headerText={t('Descheduler settings')}
    >
      <Form>
        <FormGroup fieldId="descheduler">
          <Checkbox
            id="descheduler"
            isChecked={isOn}
            onChange={setOn}
            label={t('Allow the Descheduler to evict the VM via live migration')}
          />
        </FormGroup>
        {isOn && (
          <Alert isInline variant={AlertVariant.info} title={t('Active descheduler')}>
            {/* TODO fix the message */}
            {t('This VM is subject to the descheduler profiles configured for eviction.')}
          </Alert>
        )}
      </Form>
    </TabModal>
  );
};

export default DeschedulerModal;
