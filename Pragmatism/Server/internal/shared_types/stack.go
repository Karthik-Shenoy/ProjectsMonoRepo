package shared_types

import "fmt"

type Stack[T any] struct {
	stackItems []T
}

func (s *Stack[T]) Push(item T) {
	s.stackItems = append(s.stackItems, item)
}

func (s *Stack[T]) Top() (*T, error) {
	if len(s.stackItems) <= 0 {
		return nil, fmt.Errorf("Tried to get top of empty stack")
	}
	return &s.stackItems[0], nil
}

func (s *Stack[T]) Pop() (*T, error) {
	n := len(s.stackItems)
	top, err := s.Top()
	if err != nil {
		return nil, err
	}
	s.stackItems = s.stackItems[:n]
	return top, nil
}
