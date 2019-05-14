export default function grammar() {
  return `
    /*STRIPS PDDL parser for http://pegjs.org/online
    For example of parsing this grammar, see https://gist.github.com/primaryobjects/1d2f7ee668b62ca99095
    Example PDDL domain to parse:

    (define (domain random-domain)
      (:requirements :strips)
      (:action op1
        :parameters (?x1 ?x2 ?x3)
        :precondition (and (S ?x1 ?x2) (R ?x3 ?x1))
        :effect (and (S ?x2 ?x1) (S ?x1 ?x3) (not (R ?x3 ?x1))))
      (:action op2
        :parameters (?x1 ?x2 ?x3)
        :precondition (and (S ?x3 ?x1) (R ?x2 ?x2))
        :effect (and (S ?x1 ?x3) (not (S ?x3 ?x1)))))
    */

    program   = result:domain { return result; }

    domain = space* delimiter* "define" space* delimiter* "domain" space* domainName:word delimiter* req:req actions:action*
    {
      var reqs = '';
      for (var i in req) {
        reqs += req[i] + ', ';
      }

      return { domain: domainName.join('').replace(/[,:?]/g, ''), requirements: req, actions: actions };
    }

    req = ":requirements" req:reqType* delimiter*
    {
      var result = [];
      for (var i in req) {
        result.push(req[i]);
      }

      return result;
    }

    reqType = space* ":" req:word
    { return req.join('').replace(/[,:?]/g, ''); }

    action = ":action" space* operationName:word parameters:parameters precondition:precondition effect:effect
    { return { action: operationName.join('').replace(/[,:?]/g, ''), parameters: parameters, precondition: precondition, effect: effect }; }

    logic = operation:logicOp* delimiter* action:word space* params:parameter* delimiter*
    { return { operation: operation.join('').replace(/[,:? ]/g, ''), action: action.join('').replace(/[,:? ]/g, ''), parameters: params }; }

    boolean   = "#t" / "#f"
    integer   = [1-9] [0-9]*
    string    = "\"" ("\\" . / [^"])* "\""
    word      = word:([a-zA-Z0-9\-]+) { return word; }
    symbol    = (!delimiter .)+
    space     = [\n\r\t ]
    paren     = "(" / ")"
    logicOp   = "and" / "not"
    delimiter = paren / space

    parameters = space* ":parameters" delimiter+ params:parameter+ delimiter space*
    { return params; }

    parameter = "?" param:word space*
    { return param.join('').replace(/[,:? ]/g, ''); }

    precondition = space* ":precondition" delimiter+ logic:logic+
    { return logic; }

    effect = space* ":effect" delimiter+ logic:logic+
    { return logic; }
  `
}