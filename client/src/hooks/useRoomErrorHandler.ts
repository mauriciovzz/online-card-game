import { useCallback } from "react";
import { useNavigate } from "react-router";

import { ERROR_METADATA } from "@/constants";
import { useNotification } from "./useNotification";

import type { ErrorCode } from "@shared/constants/errorCodes";

export const useRoomErrorHandler = () => {
  const navigate = useNavigate();
  const { errorNoti } = useNotification();

  const handleError = useCallback(
    (error: ErrorCode) => {
      const meta = ERROR_METADATA[error];

      if (meta.message) {
        errorNoti(meta.message);
      }

      if (meta.redirect) {
        void navigate(meta.redirect, { replace: true });
      }
    },
    [errorNoti, navigate]
  );

  return handleError;
};
