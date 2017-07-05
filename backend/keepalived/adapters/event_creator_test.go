package adapters

import (
	"testing"

	"github.com/sensu/sensu-go/backend/messaging"
	"github.com/sensu/sensu-go/testing/mockbus"
	"github.com/sensu/sensu-go/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestWarnEvent(t *testing.T) {
	assert := assert.New(t)

	mockBus := &mockbus.MockBus{}
	mockBus.On("Publish", messaging.TopicEvent, mock.Anything).Return(nil).Run(func(args mock.Arguments) {
		event := args[1].(*types.Event)
		assert.Equal(1, event.Check.Status)
	})
	creator := &MessageBusEventCreator{
		MessageBus: mockBus,
	}
	entity := types.FixtureEntity("entity")
	assert.NoError(creator.Warn(entity))
}

func TestCriticalEvent(t *testing.T) {
	assert := assert.New(t)

	mockBus := &mockbus.MockBus{}
	mockBus.On("Publish", messaging.TopicEvent, mock.Anything).Return(nil).Run(func(args mock.Arguments) {
		event := args[1].(*types.Event)
		assert.Equal(2, event.Check.Status)
	})
	creator := &MessageBusEventCreator{
		MessageBus: mockBus,
	}
	entity := types.FixtureEntity("entity")
	assert.NoError(creator.Critical(entity))
}
