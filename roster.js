// Both avatars share the same movement controller, position and task state.
export function createRoster(player,guide,actors,initial='boy'){
 let selected=null;
 const roster={get selected(){return selected},get actor(){return actors[selected]},get guideActor(){return actors[selected==='boy'?'girl':'boy']},select(role){
  if(!actors[role])return false;
  if(selected===role)return true;
  for(const actor of Object.values(actors)){actor.setSpeed(0);actor.update(.3)}
  selected=role;player.add(roster.actor.object);guide.add(roster.guideActor.object);return true;
 }};
 roster.select(initial==='girl'?'girl':'boy');return roster;
}
