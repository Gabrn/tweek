import React from 'react';
import R from 'ramda';
import style from './Matcher.css';
import PropertyName from './Properties/PropertyName';
import PropertyPredicate from './Properties/PropertyPredicate';
import {shouldUpdate} from 'recompose';
import * as ContextService from '../../../../../../../../services/context-service';

const Property = ({property, predicate, mutate, suggestedValues = [], canBeClosed = true, autofocus}) =>
  (<div className={style['condition-wrapper']}>
    <button onClick={mutate.delete}
            className={style['delete-condition-button']}
            title="Remove condition"
            disabled={!canBeClosed}
    />
    <PropertyName {...{property, mutate, suggestedValues, autofocus}} />
    <PropertyPredicate {...{predicate, mutate, property}} />
  </div>);

const hasChanged = shouldUpdate((props, nextProps) =>
!R.equals(props.matcher, nextProps.matcher) || !R.equals(props.mutate.path, nextProps.mutate.path));

export default hasChanged(({matcher, mutate, autofocus}) => {
  const [ops, props] = R.pipe(R.toPairs, R.partition(([prop]) => prop[0] === '$'))(matcher);
  const IgnoreActivePropsPropsPredicate = R.compose(R.not, R.contains(R.__, R.map(R.head, props)));

  const allSuggestions = ContextService.getProperties().map(prop => ({ label: prop.name, value: prop.id }));

  const filterActiveProps = (currentProp) =>
    allSuggestions.filter(x => x.value === currentProp || IgnoreActivePropsPropsPredicate(x.value));

  const canBeClosed = props.length > 1;
  return (
    <div className={style['matcher']}>
      {
        props.map(([property, predicate], i) => {

          const suggestedValues = filterActiveProps(property);
          return (
            <Property key={i}
                      mutate={mutate.in(property) }
                      {...{suggestedValues, property, predicate, canBeClosed, autofocus}}
            />
          );
        })
      }
      <button className={style['add-condition-button']}
              onClick={() => mutate.insert('', '') }
              title="Add condition"
      />
    </div>);
});
