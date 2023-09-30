class Vote {
    constructor(elVote) {
        this._attributes = {
            processed: 'processed',
            voterName: 'voter-name'
        };

        this._element = elVote;
        this._elVoter = this._element.querySelector('td[class*=mat-column-displayName]');
        this._elPoint = this._element.querySelector('div[class*=flip-card-back]').querySelectorAll(':scope > span')[0];

        if (!this._element.hasAttribute(this._attributes.processed)) {
            this._elVoter.setAttribute(this._attributes.voterName, this._elVoter.innerText);
        }
        this._element.setAttribute(this._attributes.processed, null);
    }

    getPoint() {
        const point = parseFloat(this._elPoint.innerText);
        return isNaN(point) ? null : point;
    }

    getVoterName() {
        return this._elVoter.getAttribute(this._attributes.voterName);
    }

    setVoterDisplayName(displayName) {
        this._elVoter.innerText = displayName;
    }

    highlight() {
        this._elVoter.style.color = '#ff0000';
        this._elVoter.style.fontWeight = 600;
    }

    unHighlight() {
        this._elVoter.style.color = null;
        this._elVoter.style.fontWeight = 'normal';
    }

    static getVotes(doc) {
        let elVotes = doc.querySelector('tbody[role="rowgroup"]')?.childNodes;
        if (elVotes === null || elVotes === undefined) return;

        // Convert NoteList to ChildNode[]
        elVotes = Array.from(elVotes);

        // Only TR rows are actually votes.
        elVotes = elVotes.filter(elVote => elVote.nodeName === 'TR');

        return elVotes.map(elVote => new Vote(elVote));
    }
}

class ScrumPoker {
    constructor(doc) {
        this._intervalHandle = null;
        this._document = doc;
    }

    highlightTopPoints(votes, enabled) {
        const topPoint = {
            votes: [],
            value: -1
        }

        votes.forEach(vote => {
            const point = vote.getPoint();
            if (point === null) return;

            if (topPoint.value < point) {
                topPoint.votes = [];
                topPoint.value = point;
            }

            if (topPoint.value === point) {
                topPoint.votes.push(vote);
            }
        });

        topPoint.votes.forEach(vote => {
            if (enabled) {
                vote.highlight();
            } else {
                vote.unHighlight();
            }
        });
    }

    showPoints(votes, enable) {
        votes.forEach(vote => {
            if (enable) {
                const point = vote.getPoint() ?? ' ';
                const displayName = point + ' - ' + vote.getVoterName();
                vote.setVoterDisplayName(displayName);
            } else {
                vote.setVoterDisplayName(vote.getVoterName());
            }
        });
    }

    runHack(doc, enabled) {
        const votes = Vote.getVotes(doc);

        if (votes !== null) {
            this.highlightTopPoints(votes, enabled);
            this.showPoints(votes, enabled);
        }
    }

    run() {
        if (!window.location.href.includes('scrumpoker-online.org'))
            return;

        const fnKeyDown = (e) => {
            if (e.key === 'Control') {
                if (this._intervalHandle === null) {
                    this._intervalHandle = setInterval(() => this.runHack(this._document, true), 100);
                }
            }
        }
        this._document.addEventListener("keydown", fnKeyDown);

        const fnKeyUp = (e) => {
            if (e.key === 'Control') {
                clearInterval(this._intervalHandle);
                this._intervalHandle = null;

                this.runHack(this._document, false);
            }
        }
        this._document.addEventListener("keyup", fnKeyUp);
    }
}

const scrumPoker = new ScrumPoker(document);
scrumPoker.run();