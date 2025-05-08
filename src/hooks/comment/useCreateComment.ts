import { useMutation } from '@tanstack/react-query';
import { commentService } from '../../services';
import { CommentCreate } from '../../models';

export const useCreateComment = () => {
    return useMutation({
        mutationKey: ['useCreateComment'],
        mutationFn: ({
            newComment,
            appointmentId,
        }: {
            newComment: CommentCreate;
            appointmentId: number;
        }) =>
            commentService.createComment({
                newComment,
                appointmentId,
            }),
    });
};
