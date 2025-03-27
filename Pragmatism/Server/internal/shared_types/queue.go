package shared_types

import (
	"fmt"
	"pragmatism/api"
	container_manager_contracts "pragmatism/internal/services/containermanagerservice/contracts"
)

type QueueItem interface {
	*api.TaskSubmitRequest | *container_manager_contracts.TaskNotifierWrapper
}

type Queue[T QueueItem] struct {
	queueItems []T
}

func (q *Queue[T]) Enqueue(item T) {
	q.queueItems = append(q.queueItems, item)
}

func (q *Queue[T]) Dequeue() (T, error) {
	if len(q.queueItems) == 0 {
		return nil, fmt.Errorf("Queue.Dequeue: queue is empty")
	}
	item := q.queueItems[0]
	q.queueItems = q.queueItems[1:]
	return item, nil
}

func (q *Queue[T]) IsEmpty() bool {
	return len(q.queueItems) == 0
}

func (q *Queue[T]) Peek() (T, error) {
	if len(q.queueItems) == 0 {
		return nil, fmt.Errorf("Queue.Peek: queue is empty")
	}
	return q.queueItems[0], nil
}

func (q *Queue[T]) CSize() uint16 {
	return uint16(len(q.queueItems))
}

func NewQueue[T QueueItem]() *Queue[T] {
	return &Queue[T]{
		queueItems: make([]T, 0),
	}
}
