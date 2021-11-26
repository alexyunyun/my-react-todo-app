import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 单行待办项
class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.todoItem.todoId,
            checked: false
        }
    }

    handleStatusChange() {
        this.setState({
            checked: !this.state.checked
        }, () => {
            let item = {
                id: this.state.id,
                status: this.state.checked
            }
            this.props.onStatusChange(item);
        })

    }

    handleDeleteItem(id) {
        this.props.onDeleteItem(id);
    }

    render() {
        // 从父组件获取状态
        const id = this.props.todoItem.todoId;
        const status = this.props.todoItem.status;
        const todoName = this.props.todoItem.name;
        const checked = this.state.checked;
        return (
            <div className={`todo-item ${status ? 'todo-done' : 'todo-undone'}`}>
                <input type="checkbox" checked={checked || status} onChange={this.handleStatusChange.bind(this)}
                       disabled={status}/>
                <span className={"todo-item-text"}>{todoName}</span>
                <button onClick={this.handleDeleteItem.bind(this, id)}>X</button>
            </div>
        )
    }
}

// 承载列表项的列表容器
class TodoListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
    }

    handleStatusChange(item) {
        this.props.onStatusChange(item);
    }

    handleDeleteItem(id) {
        this.props.onDeleteItem(id);
    }

    render() {
        // 分别渲染当前容器的状态，分为已完成和待办
        const stage = this.props.stage;
        const stageText = stage === 'done' ? '已完成' : '待办'
        const todoItems = this.props.todoItems;
        const rows = todoItems.map((todoItem, index) => {
            if ((todoItem.status ? 'done' : 'undone') === stage) {
                return (
                    <TodoItem key={index} todoItem={todoItem}
                              onStatusChange={this.handleStatusChange}
                              onDeleteItem={this.handleDeleteItem}
                    />
                )
            }
            return null;
        })
        return (
            <div className="todo-list-container">
                <h3>{stageText}</h3>
                <div className={"todo-rows"}>
                    {rows}
                </div>
            </div>
        );
    }
}

// 容器主体，分别渲染待办列表和已完成列表
class TodoBody extends React.Component {
    handleDeleteItem(id) {
        this.props.onDeleteItem(id);
    }

    handleStatusChange(item) {
        this.props.onStatusChange(item);
    }

    render() {
        const todoItems = this.props.todoItems;
        return (
            <div className="todo-body-container">
                <TodoListContainer stage="undone" todoItems={todoItems}
                                   onStatusChange={this.handleStatusChange.bind(this)}
                                   onDeleteItem={this.handleDeleteItem.bind(this)}
                />
                <TodoListContainer stage="done" todoItems={todoItems}
                                   onStatusChange={this.handleStatusChange.bind(this)}
                                   onDeleteItem={this.handleDeleteItem.bind(this)}
                />
            </div>
        )
    }
}

class AddBox extends React.Component {
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleAddTodoText = this.handleAddTodoText.bind(this);
        this.handleEnterKeyUp = this.handleEnterKeyUp.bind(this);
        // 此处设置state是因为点击button时才确定下最终的todoText，所以需要有一个变量来保存这个值
        this.state = {
            todoText: ''
        }
    }

    handleTextChange(e) {
        this.setState({
            todoText: e.target.value
        })
    }

    handleEnterKeyUp(e) {
        if (e.keyCode === 13) {
            this.setState({
                todoText: e.target.value
            }, () => this.handleAddTodoText())
        }
    }

    handleAddTodoText() {
        let text = this.state.todoText;
        if (text.trim() === '') {
            alert('待办项不能为空');
            return;
        }
        this.props.onAddTodoText(this.state.todoText);
        this.setState({
            todoText: ''
        })
    }

    render() {
        return (
            <div className="add-box">
                <input type="text"
                       value={this.state.todoText}
                       onChange={this.handleTextChange}
                       onKeyUp={this.handleEnterKeyUp}
                />


                <button onClick={this.handleAddTodoText}>添加</button>
            </div>
        )
    }
}


// 顶层容器TodoAppContainer
class TodoAppContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoId: 0,
            todoText: '',
            todoItems: []
        }
        this.handleAddTodoText = this.handleAddTodoText.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
    }

    handleAddTodoText(todoText) {
        let todoItem = {
            todoId: this.state.todoId + 1,
            name: todoText,
            status: false
        }
        this.setState((state) => ({
            todoId: state.todoId + 1,
            todoItems: state.todoItems.concat(todoItem)
        }))

    }

    handleStatusChange(item) {
        const todoItems = this.state.todoItems;
        const newTodoItems = todoItems.slice(0);

        newTodoItems.forEach((todoItem) => {
            if (todoItem.todoId === item.id) {
                todoItem.status = item.status;
            }
        })

        this.setState({
            todoItems: newTodoItems
        })
    }

    handleDeleteItem(id) {
        const todoItems = this.state.todoItems;
        const newTodoItems = todoItems.filter((todoItem) => {
            return todoItem.todoId !== id
        })
        this.setState({
            todoItems: newTodoItems
        })
    }

    render() {
        return (
            <div>
                <h1 className="todo-title">待办事项</h1>
                <div className="todo-app-container">
                    <AddBox onAddTodoText={this.handleAddTodoText}/>
                    <TodoBody todoItems={this.state.todoItems} onStatusChange={this.handleStatusChange}
                              onDeleteItem={this.handleDeleteItem}/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<TodoAppContainer/>, document.getElementById('root'));