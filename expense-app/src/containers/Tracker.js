import { FaChevronLeft, FaSpinner } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormState, useVerify } from '../hooks';
import { createExpense, deleteExpense, updateExpense } from '../actions';
import ExpenseForm from '../components/ExpenseForm';
import Expense from '../components/Expense';
import { getExpenses } from '../selectors';

const Tracker = () => {
  const {
    isLoading, error, dispatch, navigate,
  } = useVerify();

  const [searchParams] = useSearchParams();
  const listName = searchParams.get('list');
  const listId = searchParams.get('id');

  const expenses = useSelector(getExpenses);

  const {
    state = {}, handleChange, visible, toggleDisplay, reset,
  } = useFormState();

  const cancelAction = () => {
    reset();
    toggleDisplay();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createExpense(listId, state));
    toggleDisplay();
    reset();
  };

  const handleUpdate = (id, data) => dispatch(updateExpense(id, data));

  const handleDelete = (id) => dispatch(deleteExpense(id));

  return (
    <>
      <div className="wrap-page mw-container mx-auto">
        <h3>{listName}</h3>

        <div className="mt-4 mx-auto">
          {visible && (
            <div className="mb-3">
              <ExpenseForm
                title={state.title || ''}
                amount={state.amount || ''}
                date={state.date || ''}
                notes={state.notes || ''}
                setter={handleChange}
                submit={handleCreate}
                cancel={cancelAction}
              />
            </div>
          )}
          <div>
            {!visible && (
              <div className="track-it">
                <button type="button" className="btn btn-sm" onClick={() => navigate('/app')}>
                  <FaChevronLeft />
                  <span className="ms-2">Back to Lists</span>
                </button>
                <button type="button" className="btn btn-sm" onClick={toggleDisplay}>
                  Add expense
                </button>
              </div>
            )}
            {isLoading ? (
              <p className="page-loading"><FaSpinner /></p>
            ) : (
              <ul className="expenses mt-4 pt-3">
                {expenses?.map((expense) => (
                  <Expense
                    key={expense.id}
                    id={expense.id}
                    title={expense.title}
                    amount={expense.amount}
                    date={expense.date}
                    notes={expense.notes}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                )) ?? <li>No record of expenses</li>}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tracker;
