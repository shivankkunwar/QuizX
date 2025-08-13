export function dateLabel(t:number){
    const d = new Date(t*1000);
    const today = new Date(); today.setHours(0,0,0,0);
    const that = new Date(d); today.setHours(0,0,0,0);

    const diffDays = Math.floor((today.getTime() - that.getTime()) / (1000 * 60 * 60 * 24));

    if(diffDays === 0)
        return "Today"
    if(diffDays === 1) {
        return "Yesterday";
    }
    return d.toLocaleDateString();

}

export function groupByDate(items: {created_at:number}[]){
    return items.reduce((acc, it)=>{
        const key= dateLabel(it.created_at);
        (acc[key] ||= []).push(it);
        return acc
    }, {} as Record<string, any[]>)
}


