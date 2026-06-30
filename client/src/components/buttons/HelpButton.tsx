import { IconQuestionMark } from "@tabler/icons-react";

import { AppActionIcon } from "./AppActionIcon";

interface Props {
  expand?: boolean;
  onClick: () => void;
}

export const HelpButton = (props: Props) => {
  return (
    <AppActionIcon {...props}>
      <IconQuestionMark size={20} stroke={2} />
    </AppActionIcon>
  );
};
