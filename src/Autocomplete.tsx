import classNames from 'classnames';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import React, { useState } from 'react';
import debounce from 'lodash.debounce';

type Props = {
  setEnteredPerson: (person: Person | null) => void;
  visiblePeople: Person[];
  setVisiblePeople: (array: Person[]) => void;
};

export const Autocomplete: React.FC<Props> = ({
  setEnteredPerson,
  setVisiblePeople,
  visiblePeople,
}) => {
  const [inputIsTouched, setInputIsTouched] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = debounce((searchQuery: string) => {
    const filtered: Person[] = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setVisiblePeople(filtered);
  }, 300);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputIsTouched(true);
    setQuery(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onClick={() => {
            setInputIsTouched(true);
            setQuery('');
            setEnteredPerson(null);
          }}
          onBlur={() => setInputIsTouched(false)}
        />
      </div>
      {visiblePeople.length !== 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div
            className={classNames({
              'dropdown-content': true,
              'is-hidden': !inputIsTouched,
            })}
          >
            {visiblePeople.map((person: Person) => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => {
                  setEnteredPerson(person);
                  setInputIsTouched(false);
                  setQuery(person.name);
                  setVisiblePeople(peopleFromServer);
                }}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
