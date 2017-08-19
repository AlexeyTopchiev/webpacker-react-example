import React from 'react';
import { connect } from 'react-redux';
import reactIcon from 'images/react.svg';
import { filteredTodos } from '../reducers/todos';
import TodoList from './TodoList';
import TodoConditions from './TodoConditions';
import TodoAddForm from './TodoAddForm';
import styles from './App.scss';

function App({ todos }) {
  return (
    <div>
      <img className={styles.logo} src={reactIcon} />
      <TodoConditions />
      <TodoList todos={todos} />
      <TodoAddForm />
    </div>
  );
}

export default connect(
  (state) => ({
    todos: filteredTodos(state.todos, state.app.doneFilter),
  }),
  null,
)(App);
