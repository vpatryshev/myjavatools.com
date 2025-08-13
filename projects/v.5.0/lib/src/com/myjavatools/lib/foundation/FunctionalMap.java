/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)FunctionalMap.java	5.0 11/20/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * FunctionalMap is a helper class that implements Map which maps keys from Domain set
 * to values of Domain (a.k.a. Range) that are values of function: Domain -> Codomain.
 *
 * Note that this class does not take any additional memory; lazy evaluation uses
 * only the keyset provided
 *
 * @version 5.0, 11/15/04
 *
 * @see Function
 * @see Maps
 * @see java.util.Map
 * @since 5.0
 */

public class FunctionalMap<Domain,Codomain>
     extends AbstractMap<Domain,Codomain> {
  private Function<Domain,Codomain> function;
  private Set<Domain> domain;

  /**
   * constructor
   * @param function Function&lt;Domain,Codomain> the function that maps keys to values
   * @param domain Set&lt;Domain> key set
   */
  public FunctionalMap(Function<Domain,Codomain> function,
                       Set<Domain> domain) {
    this.function = function;
    this.domain = domain;
  }

  /**
   * Returns <tt>true</tt> if this map contains a mapping for the specified key.
   *
   * @param x key whose presence in this map is to be tested.
   * @return <tt>true</tt> if this map contains a mapping for the specified
   *   key.
   */
  public boolean containsKey(Object x) {
    return keySet().contains(x);
  }

  /**
   * Returns a set view of the mappings contained in this map.
   *
   * @return a set view of the mappings contained in this map.
   *
   * Implementation note. Actually no large object is created;
   * the returned set is a lazy evaluation implementation of Set.
   */
  public Set<Map.Entry<Domain,Codomain>> entrySet() {
    return new AbstractSet<Map.Entry<Domain,Codomain>>() {

      public boolean contains(Object o) {
        if (o == null) return false;
        if (!(o instanceof Map.Entry)) return false;
        Map.Entry entry = (Map.Entry)o;
        Object key = entry.getKey();
        if (!domain.contains(key)) {
          return false;
        }

        Object value = entry.getValue();
        Codomain functionValue = function.apply((Domain)key);
        return (value == null && functionValue == null) ||
                value.equals(functionValue);
      }

      public int size() {
        return domain.size();
      }

      public Iterator<Map.Entry<Domain,Codomain>> iterator() {
        return new Iterator<Map.Entry<Domain,Codomain>>() {
          Iterator<Domain> source = domain.iterator();

          public Map.Entry<Domain,Codomain> next() {
            Domain x = source.next();
            return new Pair<Domain,Codomain>(x, function.apply(x));
          }

          public boolean hasNext() {
            return source.hasNext();
          }

          public void remove() {
            source.remove();
          }
        };
      }
    };
  }
}
