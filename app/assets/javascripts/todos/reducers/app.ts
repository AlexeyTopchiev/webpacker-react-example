import * as _ from 'lodash'
import * as actions from '../actions'

export type SortBy = 'dueDate' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface Request {
  requesting: boolean
  error: Error | null
}

interface RequestTable {
  [id: number]: Request | undefined,
}

export const SINGLETON_ID = 0
export interface AppState {
  readonly doneFilter: boolean
  readonly sortBy: SortBy
  readonly sortOrder: SortOrder
  readonly requests: {
    // If a request is for creation, which means id doesn't exist yet, the index of table should be 0.
    // In this case, RequestTable would be a singleton.
    // This convention increases code reuse between reducers below requests.
    addTodo: RequestTable,
    updateTodo: RequestTable,
    toggleTodoDone: RequestTable,
    deleteTodo: RequestTable,
  }
}

const initialState: AppState = {
  doneFilter: false,
  sortBy: 'dueDate',
  sortOrder: 'desc',
  requests: {
    addTodo: {},
    updateTodo: {},
    toggleTodoDone: {},
    deleteTodo: {},
  },
}

function toggleDoneFilter(state: AppState) {
  return {
    ...state,
    doneFilter: !state.doneFilter,
  }
}

function selectOrder(state: AppState, action: actions.SelectOrder) {
  return {
    ...state,
    sortBy: action.payload.sortBy,
    sortOrder: action.payload.sortOrder,
  }
}

interface RequestedAction {
  payload: { requestId: number }
}
function handleRequested(target: keyof AppState['requests'], state: AppState, action: RequestedAction) {
  return {
    ...state,
    requests: {
      ...state.requests,
      [target]: {
        ...state.requests[target],
        [action.payload.requestId]: {
          requesting: true,
          error: null,
        },
      },
    },
  }
}

interface ReceivedAction {
  payload: { requestId: number } | actions.IdentifiableError
}
function handleReceived(target: keyof AppState['requests'], state: AppState, action: ReceivedAction) {
  let table
  if (action.payload instanceof actions.IdentifiableError) {
    table = {
      ...state.requests[target],
      [action.payload.targetId]: {
        requesting: false,
        error: action.payload,
      },
    }
  } else {
    table = _.omit(state.requests[target], [action.payload.requestId])
  }

  return {
    ...state,
    requests: {
      ...state.requests,
      [target]: table,
    },
  }
}

export default function appReducer(state: AppState = initialState, action: actions.Action): AppState {
  switch (action.type) {
    case 'TOGGLE_DONE_FILTER':
      return toggleDoneFilter(state)
    case 'SELECT_ORDER':
      return selectOrder(state, action)
    case 'ADD_TODO:REQUESTED':
      return handleRequested('addTodo', state, action)
    case 'ADD_TODO:RECEIVED':
      return handleReceived('addTodo', state, action)
    case 'UPDATE_TODO:REQUESTED':
      return handleRequested('updateTodo', state, action)
    case 'UPDATE_TODO:RECEIVED':
      return handleReceived('updateTodo', state, action)
    case 'TOGGLE_TODO_DONE:REQUESTED':
      return handleRequested('toggleTodoDone', state, action)
    case 'TOGGLE_TODO_DONE:RECEIVED':
      return handleReceived('toggleTodoDone', state, action)
    case 'DELETE_TODO:REQUESTED':
      return handleRequested('deleteTodo', state, action)
    case 'DELETE_TODO:RECEIVED':
      return handleReceived('deleteTodo', state, action)
    default:
      return state
  }
}
