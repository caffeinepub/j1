import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Result } from "../backend";
import { useActor } from "./useActor";

export function useResults() {
  const { actor, isFetching } = useActor();
  return useQuery<Result[]>({
    queryKey: ["results"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getResults();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (result: Result) => {
      if (!actor) throw new Error("Not connected");
      return actor.addResult(result);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["results"] }),
  });
}

export function useUpdateResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (result: Result) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateResult(result);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["results"] }),
  });
}

export function useDeleteResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteResult(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["results"] }),
  });
}
