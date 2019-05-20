export default function domain () { 
  const texts = [
    `
    ;; Magic World PDDL Domain - by Kory Becker http://primaryobjects.com/kory-becker
    ;; Example from the node.js strips library http://npmjs.org/strips

    (define (domain magic-world)
      (:requirements :strips :typing)
      (:types player location monster element chest)

      (:action move
          :parameters (?p - player ?l1 - location ?l2 - location)
          :precondition (and (at ?p ?l1) (border ?l1 ?l2) (not (guarded ?l2)))
          :effect (and (at ?p ?l2) (not (at ?p ?l1)))
      )

      (:action attack
          :parameters (?p - player ?m - monster ?l1 - location ?l2 - location)
          :precondition (and (at ?p ?l1) (at ?m ?l2) (border ?l1 ?l2) (guarded ?l2))
          :effect (not (at ?m ?l2) not (guarded ?l2))
      )

      (:action open
          :parameters (?p - player ?c - chest ?l1 - location)
          :precondition (and (at ?p ?l1) (at ?c ?l1) (not (open ?c)))
          :effect (and (open ?c))
      )

      (:action collect-fire
          :parameters (?p - player ?c - chest ?l1 - location ?e - element)
          :precondition (and (at ?p ?l1) (at ?c ?l1) (open ?c) (fire ?e) (in ?e ?c) (not (empty ?c))
          :effect (and (empty ?c) (has-fire ?p))
      )

      (:action collect-earth
          :parameters (?p - player ?c - chest ?l1 - location ?e - element)
          :precondition (and (at ?p ?l1) (at ?c ?l1) (open ?c) (earth ?e) (in ?e ?c) (not (empty ?c))
          :effect (and (empty ?c) (has-earth ?p))
      )

      (:action build-fireball
          :parameters (?p - player)
          :precondition (and (has-fire ?p) (has-earth ?p))
          :effect (and (has-fireball ?p) (not (has-fire ?p) not (has-earth ?p)))
      )
    )
    `,
    `
    (define (domain war)
      (:requirements :strips :typing)
      (:types kingdom location army)

      (:action move
          :parameters (?army - army ?location1 - location ?location2 - location)
          :precondition (and (at ?army ?location1) (border ?location1 ?location2) (not (guarded ?location2)))
          :effect (and (at ?army ?location2) (not (at ?army ?location1)))
      )

      (:action attack
          :parameters (?army_1 - army ?army_2 - army ?l1 - location ?l2 - location)
          :precondition (and (at ?army_1 ?l1) (at ?army_2 ?l2) (border ?l1 ?l2) (guarded ?l2))
          :effect (not (at ?army_2 ?l2) not (guarded ?l2))
      )

    )
    `,
  ];

  return texts[0]
}