import {
  SegmentedControl,
  Stack,
  Title,
} from "@mantine/core";
import { MainLayout } from "@/layouts";
import { AppBox, Label } from "@/components";
import { useIsMobile } from "@/hooks";
import { ROOM_CAPACITY_OPTIONS } from "@/constants";

export const GameTest = () => {
  const isMobile = useIsMobile();
  return (
    <MainLayout>
      <Title w="100%">Besties</Title>
      <AppBox>
        <Stack gap={0} w="100%">
          <Label size="sm" text={"room.numPlayers"} />
          <SegmentedControl
            size={isMobile ? "md" : "sm"}
            data={ROOM_CAPACITY_OPTIONS}
          />
        </Stack>
      </AppBox>
    </MainLayout>
  );
};
