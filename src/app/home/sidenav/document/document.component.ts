import {Component, Input, OnInit} from '@angular/core';
import {SelectedDocument} from '../sidenav.component';
import {WordSet} from '../../comparison/comparison.component';
import {SearchQuery} from '../../../services/query.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  @Input() document: SelectedDocument;
  @Input() highlightedExactMatches: Set<string>;
  @Input() highlightedSoftMatches: Set<string>;
  @Input() highlightedWordSet: WordSet;
  @Input() hoveredWord: string;
  @Input() searchQuery: SearchQuery;

  constructor() { }

  ngOnInit(): void {

  }

}
